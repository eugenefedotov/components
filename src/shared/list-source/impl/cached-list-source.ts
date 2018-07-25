import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {ListSourceRequestModel} from '../models/list-source-request.model';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export class CachedListSource<T> implements ListSource<T> {

    private count: number;
    private cache = new Map<number, T>();

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

        const correctedRequest = this.correctRequest(request);

        return this.listSource.getData(correctedRequest)
            .pipe(
                tap(response => this.toCache(correctedRequest, response)),
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

    private getFromCache(request: ListSourceRequestModel): ListSourceResponseModel<T> {
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

    private correctRequest(request: ListSourceRequestModel): ListSourceRequestModel {
        request = {...request};

        request.limit = Math.max(request.limit, this.minRequestSize);

        if (this.count) {
            request.limit = Math.min(request.limit, this.count - request.offset);
        }

        return request;
    }
}
