import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaymentServiceEntity} from '../../../../dao/payment-service/payment-service.entity';
import {RestClientDataSource} from '../../../../shared/classes/data-source/impl/rest-client-data-source';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceRestService extends RestClientDataSource<PaymentServiceEntity> {
    constructor(http: HttpClient) {
        super(http, 'api/payment-service', PaymentServiceEntity);
    }
}
