import {DataSourceResponseModel} from './models/data-source-response.model';
import {DataSourceRequestModel} from './models/data-source-request.model';
import {ListSource} from '../list-source/list-source';
import {Observable} from 'rxjs';

export interface DataSource<T> extends ListSource<T> {
    getData(request: DataSourceRequestModel<T>): Observable<DataSourceResponseModel<T>>;
}
