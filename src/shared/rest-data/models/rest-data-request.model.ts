import {RestDataRequestFilterModel} from './rest-data-request-filter.model';
import {RestDataRequestSortModel} from './rest-data-request-sort.model';

export interface RestDataRequestModel<T> {
    filter?: RestDataRequestFilterModel<T>;
    sort?: RestDataRequestSortModel<T>[];
    fields?: (keyof T)[];
    offset?: number;
    limit?: number;
}