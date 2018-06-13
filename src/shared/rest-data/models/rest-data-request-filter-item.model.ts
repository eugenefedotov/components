import {RestDataRequestFilterTypeEnum} from './rest-data-request-filter-type.enum';

export interface RestDataRequestFilterItemModel<T, K extends keyof T = any>  {
    type: RestDataRequestFilterTypeEnum,
    field: K,
    values: T[K][]
}