import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {RestClientDataSource} from '../../../../shared/data-source/impl/rest-client-data-source';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceCurrencyRestService extends RestClientDataSource<PaymentServiceCurrencyEntity> {
    constructor(http: HttpClient) {
        super(http, 'api/payment-service-currency');
    }
}
