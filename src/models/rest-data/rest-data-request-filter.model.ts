import {RestDataRequestFilterTypeEnum} from './rest-data-request-filter-type.enum';

export type RestDataRequestFilterModel<T> = {
    [P in keyof T]?: {
        type: RestDataRequestFilterTypeEnum,
        values: T[P] | T[P][]
    } | T[P] | T[P][];
}