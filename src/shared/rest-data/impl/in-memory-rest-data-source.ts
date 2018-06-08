import {RestDataRequestModel} from '../models/rest-data-request.model';
import {RestDataResponseModel} from '../models/rest-data-response.model';
import {RestDataRequestFilterModel} from '../models/rest-data-request-filter.model';
import {RestDataRequestSortModel} from '../models/rest-data-request-sort.model';
import {RestDataSource} from '../rest-data-source';
import {RestDataRequestFilterTypeEnum} from '../models/rest-data-request-filter-type.enum';
import {RestDataRequestSortOrderEnum} from '../models/rest-data-request-sort-order.enum';

export class InMemoryRestDataSource<T> implements RestDataSource<T> {
    constructor(private items: T[]) {

    }

    async getResult(request: RestDataRequestModel<T>): Promise<RestDataResponseModel<T>> {
        const response: RestDataResponseModel<T> = {items: null, count: null};
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

    private filterItems(items: T[], filter: RestDataRequestFilterModel<T>): T[] {

        Object.keys(filter).forEach((field) => {
            const fieldFilter = filter[field];
            const fieldFilterType: RestDataRequestFilterTypeEnum = 'type' in fieldFilter ? fieldFilter.type : RestDataRequestFilterTypeEnum.Equal;
            const values: any[] | any = 'values' in fieldFilter ? fieldFilter.values : fieldFilter;

            items = this.filterItemsByField(items, field as keyof T, fieldFilterType, values);
        });

        return items;
    }

    private filterItemsByField<P extends keyof T>(items: T[], field: keyof T, type: RestDataRequestFilterTypeEnum, values: T[P][] | T[P]): T[] {
        return items.filter(item => this.filterItemByField(item, field, type, values));
    }

    private filterItemByField<P extends keyof T>(item: T, field: P, type: RestDataRequestFilterTypeEnum, values: T[P][] | T[P]): boolean {
        if (!(field in item)) {
            return false;
        }

        const itemValue = item[field];
        const filterValues = Array.isArray(values) ? values as T[P][] : [values] as T[P][];

        return filterValues.some(filterValue => this.filterItemByValue(itemValue, type, filterValue));
    }

    private filterItemByValue<P>(itemValue: P, type: RestDataRequestFilterTypeEnum, filterValue: P): boolean {
        switch (type) {
            case RestDataRequestFilterTypeEnum.Equal:
                return itemValue === filterValue;
            case RestDataRequestFilterTypeEnum.Contains:
                return String(itemValue).includes(String(filterValue));
            case RestDataRequestFilterTypeEnum.StartWith:
                return String(itemValue).startsWith(String(filterValue));
            case RestDataRequestFilterTypeEnum.EndWith:
                return String(itemValue).endsWith(String(filterValue));
            case RestDataRequestFilterTypeEnum.LessThan:
                return itemValue < filterValue;
            case RestDataRequestFilterTypeEnum.LessThanOrEquals:
                return itemValue <= filterValue;
            case RestDataRequestFilterTypeEnum.MoreThan:
                return itemValue > filterValue;
            case RestDataRequestFilterTypeEnum.MoreThanOrEquals:
                return itemValue >= filterValue;
            default:
                throw new Error(`unknown filter type: ${type} (${RestDataRequestFilterTypeEnum[type]})`);
        }
    }

    private sortItems(items: T[], sort: RestDataRequestSortModel<T>[]): T[] {
        sort.forEach(sortItem => {
            items = this.sortItemsStep(items, sortItem);
        });

        return items;
    }

    private sortItemsStep(items: T[], sortItem: RestDataRequestSortModel<T>): T[] {
        return items.sort((item1, item2) => {
            let value1: any = item1[sortItem.field];
            let value2: any = item2[sortItem.field];

            if (typeof value1 === 'string' && typeof value2 === 'string') {
                value1 = value1.toLowerCase();
                value2 = value2.toLowerCase();

                if (value1 < value2) {
                    return sortItem.order === RestDataRequestSortOrderEnum.Desc ? 1 : -1;
                }
                if (value1 > value2) {
                    return sortItem.order === RestDataRequestSortOrderEnum.Desc ? -1 : 1;
                }

                return 0;
            }

            switch (sortItem.order) {
                case RestDataRequestSortOrderEnum.Asc:
                    return value1 - value2;
                case RestDataRequestSortOrderEnum.Desc:
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