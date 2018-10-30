import {ListSource} from '../../list-source';
import {ListSourceResponseModel} from '../../models/list-source-response.model';
import {ListSourceRequestModel} from '../../models/list-source-request.model';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {debounceTime, filter, shareReplay, switchMap, tap} from 'rxjs/operators';
import {CachedListSourceResponseModel} from './cached-list-source-response.model';
import {CachedListSourceRequestModel} from './cached-list-source-request.model';


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

    getData(request: CachedListSourceRequestModel): Observable<CachedListSourceResponseModel<T>> {
        return new Observable(subscriber => {
            const subscriptions = new Subscription();

            const fromCache = this.getFromCache(request);
            if (fromCache) {
                subscriber.next(fromCache);
            }

            if (fromCache && !fromCache.partial) {
                subscriber.complete();
            } else {
                subscriptions.add(
                    this.request(request)
                        .subscribe(() => {
                            subscriber.next(this.getFromCache(request));
                            subscriber.complete();
                        })
                );
            }

            return () => subscriptions.unsubscribe();
        });
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

    private getFromCache(request: CachedListSourceRequestModel): CachedListSourceResponseModel<T> {
        if (!request || !request.limit) {
            return {count: this.count, items: [], partial: false};
        }

        const result = [];
        let partial = false;

        for (let i = 0; i < request.limit; i++) {
            const index = i + request.offset;
            if (!this.cache.has(index)) {
                if (!request.acceptPartialResponse) {
                    return null;
                } else {
                    partial = true;
                    result.push(null);
                }
            }
            result.push(this.cache.get(index));
        }

        return {
            count: this.count,
            items: result,
            partial
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

        this.delayedRequest$ = new BehaviorSubject<ListSourceRequestModel>(request);
        this.delayedResponse$ = this.delayedRequest$
            .pipe(
                filter(Boolean),
                debounceTime(100),
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
                shareReplay(1)
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
