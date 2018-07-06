import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {ListSourceRequestModel} from '../models/list-source-request.model';

export class CachedListSource<T> implements ListSource<T> {

    private count: number;
    private cache = new Map<number, T>();
    private promises = new Map<string, Promise<ListSourceResponseModel<T>>>();

    constructor(private listSource: ListSource<T>, private minRequestSize: number) {
        if (!this.listSource) {
            throw new Error('required ListSource');
        }
    }

    async getData(request: ListSourceRequestModel): Promise<ListSourceResponseModel<T>> {
        if (!this._getRangeOutOfCache(request.offset, request.limit)) {
            return this._getResponseFromCache(request.offset, request.limit);
        }

        return this._getItems(request.offset, request.limit);
    }

    private getRequestKey(offset: number, limit: number): string {
        return `${offset}:${limit}`;
    }

    private async _getItems(offset: number, limit: number): Promise<ListSourceResponseModel<T>> {
        const range = this._getRangeOutOfCache(offset, limit);

        range.limit = Math.max(range.limit, this.minRequestSize);

        const requestKey = this.getRequestKey(range.offset, range.limit);

        if (!this.promises.has(requestKey)) {
            this.promises.set(requestKey, (async () => {
                const result = await this.listSource.getData(range);
                this.count = result.count;
                result.items.forEach((item, index) => this.cache.set(index + offset, item));

                return this._getResponseFromCache(offset, limit);
            })());
        }

        return this.promises.get(requestKey);
    }

    private _getResponseFromCache(offset: number, limit: number): ListSourceResponseModel<T> {
        return {
            items: this._getItemsFromCache(offset, limit),
            count: this.count
        };
    }

    private _getRangeOutOfCache(offset: number, limit: number): { offset: number, limit: number } {
        if (this.count) {
            limit = Math.min(limit, this.count - offset);
        }

        while (limit && this.cache.has(offset)) {
            offset++;
            limit--;
        }

        while (limit && this.cache.has(offset + limit)) {
            limit--;
        }

        return limit ? {offset, limit} : null;
    }

    private _getItemsFromCache(offset: number, limit: number): T[] {
        const result: T[] = [];

        for (let i = offset; i < offset + limit && i < this.count; i++) {
            result.push(this.cache.get(i));
        }

        return result;
    }
}
