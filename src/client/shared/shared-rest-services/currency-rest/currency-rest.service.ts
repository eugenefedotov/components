import {Injectable} from '@angular/core';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {HttpClient} from '@angular/common/http';
import {CachedDataSource} from '../../../../shared/data-source/impl/cached-data-source';
import {RestClientDataSource} from '../../../../shared/data-source/impl/rest-client-data-source';

@Injectable({
    providedIn: 'root'
})
export class CurrencyRestService extends RestClientDataSource<CurrencyEntity> {

    private cachedDataSource: CachedDataSource<CurrencyEntity>;

    constructor(http: HttpClient) {
        super(http, 'api/currency');
        this.cachedDataSource = new CachedDataSource(this, 'id');
    }

    getByKey(id: number): Promise<CurrencyEntity> {
        return this.cachedDataSource.getByKey(id);
    }
}
