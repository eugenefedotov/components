import {ListSourceResponseModel} from './models/list-source-response.model';
import {ListSourceRequestModel} from './models/list-source-request.model';
import {Observable} from 'rxjs';

export interface ListSource<T> {
    getData(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>>;
}
