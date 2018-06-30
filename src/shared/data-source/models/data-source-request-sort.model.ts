import {DataSourceRequestSortOrderEnum} from './data-source-request-sort-order.enum';

export interface DataSourceRequestSortModel<T> {
    field: keyof T;
    order: DataSourceRequestSortOrderEnum;
    nullFirst?: boolean;
}