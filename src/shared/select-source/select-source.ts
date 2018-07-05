import {SelectItemModel} from './models/select-item.model';
import {SelectSourceResponseModel} from './models/select-source-response.model';
import {SelectSourceRequestModel} from './models/select-source-request.model';
import {ListSource} from '../list-source/list-source';

export interface SelectSource<T = any> extends ListSource<SelectItemModel<T>> {
    getByValue(id: SelectItemModel['value']): Promise<SelectItemModel<T>>;

    getData(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>>;
}
