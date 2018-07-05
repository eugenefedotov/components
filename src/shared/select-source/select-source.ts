import {SelectItemModel} from './models/select-item.model';
import {SelectSourceResponseModel} from './models/select-source-response.model';
import {SelectSourceRequestModel} from './models/select-source-request.model';
import {ListSource} from '../list-source/list-source';

export interface SelectSource<T extends SelectItemModel = SelectItemModel> extends ListSource<T> {
    getByValue(id: T['value']): Promise<T>;

    getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>>;
}
