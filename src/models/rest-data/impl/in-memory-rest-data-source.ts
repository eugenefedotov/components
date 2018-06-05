import {RestDataRequestModel} from '../rest-data-request.model';
import {RestDataResponseModel} from '../rest-data-response.model';
import {RestDataRequestFilterModel} from '../rest-data-request-filter.model';
import {RestDataRequestSortModel} from '../rest-data-request-sort.model';
import {RestDataSource} from '../rest-data-source';
import {RestDataRequestFilterTypeEnum} from '../rest-data-request-filter-type.enum';
import {RestDataRequestSortOrderEnum} from '../rest-data-request-sort-order.enum';

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
            items = this.filterFields(items, request.fields);
        }

        if (request.offset || request.limit) {
            items = this.sliceItems(items, request.offset, request.limit);
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

    private filterItemsByField<P = keyof T>(items: T[], field: keyof T, type: RestDataRequestFilterTypeEnum, values: P[] | P): T[] {
        return items.filter(item => this.filterItemByField(item, field, type, values));
    }

    private filterItemByField<P = keyof T>(item: T, field: P, type: RestDataRequestFilterTypeEnum, values: P[] | P): boolean {
        if (!(field in item)) {
            return false;
        }

        const itemValue = item[field];
        const filterValues: P[] = Array.isArray(values) ? values : [values];

        return filterValues.some(filterValue => this.filterItemByValue(itemValue, type, filterValue));
    }

    private filterItemByValue<P>(itemValue: P, type: RestDataRequestFilterTypeEnum, filterValue: P): boolean {
        switch (type) {
            case RestDataRequestFilterTypeEnum.Equal:
                return itemValue === filterValue;
            case RestDataRequestFilterTypeEnum.Contains:
                return String(itemValue).includes(filterValue);
            case RestDataRequestFilterTypeEnum.StartWith:
                return String(itemValue).startsWith(filterValue);
            case RestDataRequestFilterTypeEnum.EndWith:
                return String(itemValue).endsWith(filterValue);
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
            let value1 = item1[sortItem.field];
            let value2 = item2[sortItem.field];

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
                filteredItem[field] = item[field];
            });

            return filteredItem;
        });
    }

    private sliceItems(items: T[], offset: number, limit: number): T[] {
        return items.slice(offset, offset + limit);
    }
}