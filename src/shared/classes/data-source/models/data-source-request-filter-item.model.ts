import {DataSourceRequestFilterTypeEnum} from './data-source-request-filter-type.enum';

export interface DataSourceRequestFilterItemModel<T> {
    type: DataSourceRequestFilterTypeEnum;
    field: keyof T;
    values: any[];
}
