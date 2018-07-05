import {ListSourceResponseModel} from '../../list-source/models/list-source-response.model';
import {SelectItemModel} from './select-item.model';

export interface SelectSourceResponseModel<T> extends ListSourceResponseModel<SelectItemModel<T>> {
}
