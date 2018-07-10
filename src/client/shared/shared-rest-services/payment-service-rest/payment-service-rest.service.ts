import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CachedDataSource} from '../../../../shared/data-source/impl/cached-data-source';
import {PaymentServiceEntity} from '../../../../dao/payment-service/payment-service.entity';
import {RestClientDataSource} from '../../../../shared/data-source/impl/rest-client-data-source';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceRestService extends RestClientDataSource<PaymentServiceEntity> {

    private cachedDataSource: CachedDataSource<PaymentServiceEntity>;

    constructor(http: HttpClient) {
        super(http, 'api/payment-service');
        this.cachedDataSource = new CachedDataSource(this, 'id');
    }

    getByKey(id: number): Promise<PaymentServiceEntity> {
        return this.cachedDataSource.getByKey(id);
    }
}
