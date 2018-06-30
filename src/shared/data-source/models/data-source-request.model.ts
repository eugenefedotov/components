import {DataSourceRequestSortModel} from './data-source-request-sort.model';
import {DataSourceRequestFilterItemModel} from './data-source-request-filter-item.model';

export interface DataSourceRequestModel<T> {
    filter?: DataSourceRequestFilterItemModel<T>[];
    sort?: DataSourceRequestSortModel<T>[];
    fields?: (keyof T)[];
    offset?: number;
    limit?: number;
}