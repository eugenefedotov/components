import {RestDataRequestSortModel} from './rest-data-request-sort.model';
import {RestDataRequestFilterItemModel} from './rest-data-request-filter-item.model';

export interface RestDataRequestModel<T> {
    filter?: RestDataRequestFilterItemModel<T>[];
    sort?: RestDataRequestSortModel<T>[];
    fields?: (keyof T)[];
    offset?: number;
    limit?: number;
}