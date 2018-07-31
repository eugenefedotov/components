import {DataSourceRequestSortModel} from './data-source-request-sort.model';
import {DataSourceRequestFilterItemModel} from './data-source-request-filter-item.model';
import {ListSourceRequestModel} from '../../list-source/models/list-source-request.model';

export interface DataSourceRequestModel<T> extends ListSourceRequestModel {
    filter?: DataSourceRequestFilterItemModel<T>[];
    sort?: DataSourceRequestSortModel<T>[];
    fields?: (keyof T)[];
}
