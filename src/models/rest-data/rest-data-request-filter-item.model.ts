import {RestDataRequestFilterTypeEnum} from './rest-data-request-filter-type.enum';

export type RestDataRequestFilterItemModel<T> = {
    type: RestDataRequestFilterTypeEnum,
    values: T | T[]
} | T | T[]