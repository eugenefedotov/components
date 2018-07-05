import {SelectItemModel} from './models/select-item.model';
import {SelectSourceResponseModel} from './models/select-source-response.model';
import {SelectSourceRequestModel} from './models/select-source-request.model';

export interface SelectSource<T extends SelectItemModel = SelectItemModel> {
    getByValue(id: T['value']): Promise<T>;

    getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>>;
}
