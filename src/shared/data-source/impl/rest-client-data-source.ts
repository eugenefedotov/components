import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {HttpClient} from '@angular/common/http';

export class RestClientDataSource<T> implements DataSource<T> {

    constructor(private http: HttpClient,
                private controllerUrl: string) {
    }

    getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        return this.http.post<DataSourceResponseModel<T>>(`${this.controllerUrl}/get-data`, request).toPromise();
    }
}
