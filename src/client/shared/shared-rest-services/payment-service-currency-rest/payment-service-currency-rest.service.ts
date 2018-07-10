import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {CachedDataSource} from '../../../../shared/data-source/impl/cached-data-source';
import {RestClientDataSource} from '../../../../shared/data-source/impl/rest-client-data-source';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceCurrencyRestService extends RestClientDataSource<PaymentServiceCurrencyEntity> {

    private cachedDataSource: CachedDataSource<PaymentServiceCurrencyEntity>;

    constructor(http: HttpClient) {
        super(http, 'api/payment-service-currency');
        this.cachedDataSource = new CachedDataSource(this, 'id');
    }

    getByKey(id: number): Promise<PaymentServiceCurrencyEntity> {
        return this.cachedDataSource.getByKey(id);
    }
}
