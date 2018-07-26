import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {ListSourceRequestModel} from '../models/list-source-request.model';
import {Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';


export class CachedListSource<T> implements ListSource<T> {

    private count: number;
    private cache = new Map<number, T>();

    private activeRequests = new Map<ListSourceRequestModel, Observable<ListSourceResponseModel<T>>>();

    private delayResponse: Subject<ListSourceResponseModel<T>>;
    private delayRequest: ListSourceRequestModel;
    private delayTimeout: any;

    constructor(private listSource: ListSource<T>, private minRequestSize: number) {
        if (!this.listSource) {
            throw new Error('required ListSource');
        }
    }

    getData(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
        const fromCache = this.getFromCache(request);
        if (fromCache) {
            return of(fromCache);
        }

        return this.request(request)
            .pipe(
                map(() => this.getFromCache(request))
            );
    }

    private toCache(request: ListSourceRequestModel, response: ListSourceResponseModel<T>) {
        this.count = response.count;
        for (let i = 0; i < request.limit; i++) {
            const index = i + request.offset;
            if (!this.cache.has(index)) {
                this.cache.set(index, response.items[i]);
            }
        }
    }

    private getActiveRequest(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
        if (!request || !request.limit) {
            return null;
        }

        for (const [ar, obs] of this.activeRequests.entries()) {
            if (this.isEntry(ar, request)) {
                return obs;
            }
        }

        return null;
    }

    private getFromCache(request: ListSourceRequestModel): ListSourceResponseModel<T> {
        if (!request || !request.limit) {
            return null;
        }

        const result = [];

        for (let i = 0; i < request.limit; i++) {
            const index = i + request.offset;
            if (!this.cache.has(index)) {
                return null;
            }
            result.push(this.cache.get(index));
        }

        return {
            count: this.count,
            items: result
        };
    }

    private request(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
        const activeRequest = this.getActiveRequest(request);
        if (activeRequest) {
            return activeRequest;
        }

        if (!this.delayTimeout) {

        }

    }

    private isEntry(request: ListSourceRequestModel, entry: ListSourceRequestModel): boolean {
        return request.offset <= entry.offset && request.offset + request.limit >= entry.offset + entry.limit;
    }

    private mergeRequest(request1: ListSourceRequestModel, request2: ListSourceRequestModel): ListSourceRequestModel {
        const start = Math.min(request1.offset, request2.offset);
        const end = Math.max(request1.offset + request1.limit, request2.offset + request2.limit);

        return {
            offset: start,
            limit: end - start
        };
    }

    private correctRequest(request: ListSourceRequestModel): ListSourceRequestModel {
        request = {...request};

        request.limit = Math.max(request.limit, this.minRequestSize);

        if (this.count) {
            request.limit = Math.min(request.limit, this.count - request.offset);
        }

        return request;
    }
}
