import {DataSourceRequestModel} from '../models/data-source-request.model';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestSortModel} from '../models/data-source-request-sort.model';
import {DataSource} from '../data-source';
import {DataSourceRequestFilterTypeEnum} from '../models/data-source-request-filter-type.enum';
import {DataSourceRequestSortOrderEnum} from '../models/data-source-request-sort-order.enum';
import {DataSourceRequestFilterItemModel} from '../models/data-source-request-filter-item.model';

export class LocalDataSource<T> implements DataSource<T> {
    constructor(private items: T[]) {

    }

    async getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        const response: DataSourceResponseModel<T> = {items: null, count: null};
        let items = this.items;

        if (request.filter) {
            items = this.filterItems(items, request.filter);
        }

        response.count = items.length;

        if (request.sort) {
            items = this.sortItems(items, request.sort);
        }

        if (request.fields) {
            response.items = this.filterFields(items, request.fields);
        } else {
            response.items = items;
        }

        if (request.offset || request.limit) {
            response.items = this.sliceItems(response.items, request.offset, request.limit);
        }

        response.items = items;

        return response;
    }

    private filterItems<P extends keyof T>(items: T[], filters: DataSourceRequestFilterItemModel<T, P>[]): T[] {

        filters.forEach(filter => {
            items = this.filterItemsByField(items, filter.field, filter.type, filter.values);
        });

        return items;
    }

    private filterItemsByField<P extends keyof T>(items: T[], field: keyof T, type: DataSourceRequestFilterTypeEnum, values: T[P][] | T[P]): T[] {
        return items.filter(item => this.filterItemByField(item, field, type, values));
    }

    private filterItemByField<P extends keyof T>(item: T, field: P, type: DataSourceRequestFilterTypeEnum, values: T[P][] | T[P]): boolean {
        if (!(field in item)) {
            return false;
        }

        const itemValue = item[field];
        const filterValues = Array.isArray(values) ? values as T[P][] : [values] as T[P][];

        return filterValues.some(filterValue => this.filterItemByValue(itemValue, type, filterValue));
    }

    private filterItemByValue<P>(itemValue: P, type: DataSourceRequestFilterTypeEnum, filterValue: P): boolean {
        switch (type) {
            case DataSourceRequestFilterTypeEnum.Equal:
                return itemValue === filterValue;
            case DataSourceRequestFilterTypeEnum.Contains:
                return String(itemValue).includes(String(filterValue));
            case DataSourceRequestFilterTypeEnum.StartWith:
                return String(itemValue).startsWith(String(filterValue));
            case DataSourceRequestFilterTypeEnum.EndWith:
                return String(itemValue).endsWith(String(filterValue));
            case DataSourceRequestFilterTypeEnum.LessThan:
                return itemValue < filterValue;
            case DataSourceRequestFilterTypeEnum.LessThanOrEquals:
                return itemValue <= filterValue;
            case DataSourceRequestFilterTypeEnum.MoreThan:
                return itemValue > filterValue;
            case DataSourceRequestFilterTypeEnum.MoreThanOrEquals:
                return itemValue >= filterValue;
            default:
                throw new Error(`unknown filter type: ${type} (${DataSourceRequestFilterTypeEnum[type]})`);
        }
    }

    private sortItems(items: T[], sort: DataSourceRequestSortModel<T>[]): T[] {
        sort.forEach(sortItem => {
            items = this.sortItemsStep(items, sortItem);
        });

        return items;
    }

    private sortItemsStep(items: T[], sortItem: DataSourceRequestSortModel<T>): T[] {
        return items.sort((item1, item2) => {
            let value1: any = item1[sortItem.field];
            let value2: any = item2[sortItem.field];

            if (typeof value1 === 'string' && typeof value2 === 'string') {
                value1 = value1.toLowerCase();
                value2 = value2.toLowerCase();

                if (value1 < value2) {
                    return sortItem.order === DataSourceRequestSortOrderEnum.Desc ? 1 : -1;
                }
                if (value1 > value2) {
                    return sortItem.order === DataSourceRequestSortOrderEnum.Desc ? -1 : 1;
                }

                return 0;
            }

            switch (sortItem.order) {
                case DataSourceRequestSortOrderEnum.Asc:
                    return value1 - value2;
                case DataSourceRequestSortOrderEnum.Desc:
                    return value2 - value1;
                default:
                    return 0;
            }
        });
    }

    private filterFields(items: T[], fields: (keyof T)[]): T[] {
        if (!fields || !fields.length) {
            return items;
        }

        return items.map(item => {
            const filteredItem = {};

            fields.forEach(field => {
                filteredItem[field as string] = item[field];
            });

            return filteredItem as T;
        });
    }

    private sliceItems(items: T[], offset: number, limit: number): T[] {
        return items.slice(offset, offset + limit);
    }
}