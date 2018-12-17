import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {Type} from '@angular/core/src/type';
import {map, tap} from 'rxjs/operators';
import {deserialize} from 'serializer.ts/Serializer';

export class RestClientDataSource<T> implements DataSource<T> {

    constructor(private http: HttpClient,
                private controllerUrl: string,
                private type?: Type<T>) {
    }

    getData(request: DataSourceRequestModel<T>): Observable<DataSourceResponseModel<T>> {
        return this.http.post<DataSourceResponseModel<T>>(`${this.controllerUrl}/get-data`,
            request,
            {
                params: this.getFakeParams(request)
            })
            .pipe(
                map(response => this.type ? this.deserializeResponse(response) : response)
            );
    }

    private getFakeParams(request: DataSourceRequestModel<T>): HttpParams {
        let params = new HttpParams();

        if (!environment.production) {
            params = params.append(this.controllerUrl, `${request.offset}:${request.limit}`);

            if (request.filter && request.filter.length) {
                request.filter.forEach(filter => {
                    params = params.append(filter.field as string, filter.values.join(','));
                });
            }
        }

        return params;
    }

    private deserializeResponse(response: DataSourceResponseModel<T>): DataSourceResponseModel<T> {
        return {
            ...response,
            items: deserialize(this.type as Function, response.items)
        };
    }
}
