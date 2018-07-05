import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {DataSourceRequestFilterTypeEnum} from '../models/data-source-request-filter-type.enum';

export class CachedDataSource<T> implements DataSource<T> {

    private cacheMap: Map<keyof T, T> = new Map();
    private cachePromiseMap: Map<any, Promise<T>> = new Map();
    private cacheResolveMap: Map<any, (item: T) => void> = new Map();
    private cacheRejectMap: Map<any, (err?: any) => void> = new Map();

    private queueTimeout: any;

    constructor(private dataSource: DataSource<T>,
                private key: keyof T,
                private queueBatchTimeMs = 1000) {
    }

    async getByKey(key: any): Promise<T> {
        if (this.cacheMap.has(key)) {
            return this.cacheMap.get(key);
        }

        const item = await this._getByKey(key);
        this.cacheMap.set(key, item);

        return item;
    }

    async getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        return this.dataSource.getData(request);
    }

    private _getByKey(key: any): Promise<T> {
        if (!this.cachePromiseMap.has(key)) {
            if (!this.queueTimeout) {
                this.queueTimeout = setTimeout(() => this._request(), this.queueBatchTimeMs);
            }

            this.cachePromiseMap.set(key, new Promise((resolve, reject) => {
                this.cacheResolveMap.set(key, resolve);
                this.cacheRejectMap.set(key, reject);
            }));
        }

        return this.cachePromiseMap.get(key);
    }

    private async _request() {
        this.queueTimeout = null;
        const keys = [...this.cachePromiseMap.keys()];

        try {
            const result = await this.dataSource.getData({
                filter: [
                    {
                        field: this.key,
                        type: DataSourceRequestFilterTypeEnum.Equal,
                        values: keys
                    }
                ],
                offset: 0,
                limit: keys.length
            });

            result.items.forEach(item => this.resolve(item[this.key], item));
        } catch (e) {
            keys.forEach(key => this.reject(key));
        }

        keys.forEach(key => this.clearPromise(key));
    }

    private resolve(key: any, item: T) {
        if (this.cacheResolveMap.has(key)) {
            this.cacheResolveMap.get(key)(item);
            this.clearPromise(key);
        }
    }

    private reject(key: any) {
        if (this.cacheRejectMap.has(key)) {
            this.cacheRejectMap.get(key)();
            this.clearPromise(key);
        }
    }

    private clearPromise(key: any) {
        if (this.cachePromiseMap.has(key)) {
            this.cachePromiseMap.delete(key);
            this.cacheResolveMap.delete(key);
            this.cacheRejectMap.delete(key);
        }
    }
}
