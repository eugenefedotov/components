import {Injectable} from '@angular/core';
import {DataSource} from '../../../../shared/data-source/data-source';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {DataSourceResponseModel} from '../../../../shared/data-source/models/data-source-response.model';
import {DataSourceRequestModel} from '../../../../shared/data-source/models/data-source-request.model';
import {HttpClient} from '@angular/common/http';
import {CachedDataSource} from '../../../../shared/data-source/impl/cached-data-source';

const API_URL = 'api/currency';

@Injectable({
    providedIn: 'root'
})
export class CurrencyRestService implements DataSource<CurrencyEntity> {

    private cachedDataSource: CachedDataSource<CurrencyEntity>;

    constructor(private http: HttpClient) {
        this.cachedDataSource = new CachedDataSource(this, 'id');
    }

    getByKey(id: number): Promise<CurrencyEntity> {
        return this.cachedDataSource.getByKey(id);
    }

    getData(request: DataSourceRequestModel<CurrencyEntity>): Promise<DataSourceResponseModel<CurrencyEntity>> {
        return this.http.post<DataSourceResponseModel<CurrencyEntity>>(`${API_URL}/get`, request).toPromise();
    }
}
