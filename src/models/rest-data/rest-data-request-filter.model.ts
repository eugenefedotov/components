import {RestDataRequestFilterItemModel} from './rest-data-request-filter-item.model';

export type RestDataRequestFilterModel<T> = {
    [P in keyof T]?: RestDataRequestFilterItemModel<T[P]>;
}