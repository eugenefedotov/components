import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataSource} from '../../../../shared/data-source/data-source';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {DataSourceRequestModel} from '../../../../shared/data-source/models/data-source-request.model';
import {DataSourceResponseModel} from '../../../../shared/data-source/models/data-source-response.model';
import {CachedDataSource} from '../../../../shared/data-source/impl/cached-data-source';

const API_URL = 'api/payment-service-currency';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceCurrencyRestService implements DataSource<PaymentServiceCurrencyEntity> {

    private cachedDataSource: CachedDataSource<PaymentServiceCurrencyEntity>;

    constructor(private http: HttpClient) {
        this.cachedDataSource = new CachedDataSource(this, 'id');
    }

    getByKey(id: number): Promise<PaymentServiceCurrencyEntity> {
        return this.cachedDataSource.getByKey(id);
    }

    getData(request: DataSourceRequestModel<PaymentServiceCurrencyEntity>): Promise<DataSourceResponseModel<PaymentServiceCurrencyEntity>> {
        return this.http.post<DataSourceResponseModel<PaymentServiceCurrencyEntity>>(`${API_URL}/get`, request).toPromise();
    }
}
