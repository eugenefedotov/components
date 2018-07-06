import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CachedDataSource} from '../../../../shared/data-source/impl/cached-data-source';
import {DataSourceRequestModel} from '../../../../shared/data-source/models/data-source-request.model';
import {DataSource} from '../../../../shared/data-source/data-source';
import {DataSourceResponseModel} from '../../../../shared/data-source/models/data-source-response.model';
import {PaymentServiceEntity} from '../../../../dao/payment-service/payment-service.entity';

const API_URL = 'api/payment-service';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceRestService implements DataSource<PaymentServiceEntity> {

    private cachedDataSource: CachedDataSource<PaymentServiceEntity>;

    constructor(private http: HttpClient) {
        this.cachedDataSource = new CachedDataSource(this, 'id');
    }

    getByKey(id: number): Promise<PaymentServiceEntity> {
        return this.cachedDataSource.getByKey(id);
    }

    getData(request: DataSourceRequestModel<PaymentServiceEntity>): Promise<DataSourceResponseModel<PaymentServiceEntity>> {
        return this.http.post<DataSourceResponseModel<PaymentServiceEntity>>(`${API_URL}/get`, request).toPromise();
    }
}