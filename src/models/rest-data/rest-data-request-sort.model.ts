import {RestDataRequestSortOrderEnum} from './rest-data-request-sort-order.enum';

export interface RestDataRequestSortModel<T> {
    field: keyof T;
    order: RestDataRequestSortOrderEnum;
    nullFirst?: boolean;
}