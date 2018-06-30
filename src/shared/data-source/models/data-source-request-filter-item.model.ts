import {DataSourceRequestFilterTypeEnum} from './data-source-request-filter-type.enum';

export interface DataSourceRequestFilterItemModel<T, K extends keyof T = any>  {
    type: DataSourceRequestFilterTypeEnum,
    field: K,
    values: T[K][]
}