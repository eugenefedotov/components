import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class RestClientDataSource<T> implements DataSource<T> {

    constructor(private http: HttpClient,
                private controllerUrl: string) {
    }

    getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        return this.http.post<DataSourceResponseModel<T>>(`${this.controllerUrl}/get-data`,
            request,
            {
                params: this.getFakeParams(request)
            }).toPromise();
    }

    private getFakeParams(request: DataSourceRequestModel<T>): HttpParams {
        let params = new HttpParams();

        if (!environment.production) {
            params = params.append(this.controllerUrl, `${request.offset}:${request.limit}`);

            if (request.filter && request.filter.length) {
                request.filter.forEach(filter => {
                    params = params.append(filter.field, filter.values.join(','));
                });
            }
        }

        return params;
    }
}