import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {ListSourceRequestModel} from '../models/list-source-request.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {debounceTime, filter, map, shareReplay, switchMap, tap} from 'rxjs/operators';


export class CachedListSource<T> implements ListSource<T> {

    private count: number;
    private cache = new Map<number, T>();

    private activeRequests = new Map<ListSourceRequestModel, Observable<ListSourceResponseModel<T>>>();

    private delayedRequest$: BehaviorSubject<ListSourceRequestModel>;
    private delayedResponse$: Observable<ListSourceResponseModel<T>>;


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

        return this.getDelayedRequest(this.correctRequest(request));
    }

    private getDelayedRequest(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
        this.initDelayedRequest(request);

        if (!this.isEntry(this.delayedRequest$.value, request)) {
            this.delayedRequest$.next(this.mergeRequest(this.delayedRequest$.value, request));
        }

        return this.delayedResponse$;
    }

    private initDelayedRequest(request: ListSourceRequestModel) {
        if (this.delayedRequest$) {
            return;
        }


        console.log('initDelayedRequest', request);

        this.delayedRequest$ = new BehaviorSubject<ListSourceRequestModel>(request);
        this.delayedResponse$ = this.delayedRequest$
            .pipe(
                filter(Boolean),
                tap(req => console.log('before debounce', req)),
                debounceTime(100),
                tap(req => console.log('after debounce', req)),
                tap((req) => {
                    this.activeRequests.set(req, this.delayedResponse$);
                    this.delayedRequest$ = null;
                    this.delayedResponse$ = null;
                }),
                switchMap(req => this.listSource.getData(req)
                    .pipe(
                        tap((response) => {
                            this.toCache(req, response);
                            this.activeRequests.delete(req);
                        })
                    )),
                tap(data => console.log('after getData', data)),
                shareReplay(1),
                tap(data => console.log('after shareReplay', data))
            );
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
