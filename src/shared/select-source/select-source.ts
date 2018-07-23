import {SelectItemModel} from './models/select-item.model';
import {SelectSourceResponseModel} from './models/select-source-response.model';
import {SelectSourceRequestModel} from './models/select-source-request.model';
import {ListSource} from '../list-source/list-source';
import {Observable} from 'rxjs';

export interface SelectSource<T = any> extends ListSource<SelectItemModel<T>> {
    getByValue(id: SelectItemModel['value']): Observable<SelectItemModel<T>>;

    getData(request: SelectSourceRequestModel): Observable<SelectSourceResponseModel<T>>;
}
