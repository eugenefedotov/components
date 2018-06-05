import {RestDataRequestModel} from '../rest-data-request.model';
import {RestDataResponseModel} from '../rest-data-response.model';
import {RestDataRequestFilterModel} from '../rest-data-request-filter.model';
import {RestDataRequestSortModel} from '../rest-data-request-sort.model';

export class InMemoryRestData<T> {
    constructor(private items: T[]) {

    }

    getResponse(request: RestDataRequestModel<T>): RestDataResponseModel<T> {
        const response: RestDataResponseModel<T> = {items: null, count: null};
        let items = this.items;

        if (request.filter) {
            items = this.filterItems(items, request.filter);
        }

        if (request.sort) {
            items = this.sortItems(items, request.sort);
        }

        if (request.fields) {
            items = this.filterFields(items, request.fields);
        }

        response.count = items.length;

        if (request.offset || request.limit) {
            items = this.sliceItems(items, request.offset, request.limit);
        }

        response.items = items;

        return response;
    }

    private filterItems(items: T[], filter: RestDataRequestFilterModel<T>): T[] {
        return items;
    }

    private sortItems(items: T[], sort: RestDataRequestSortModel<T>[]): T[] {
        return items;
    }

    private filterFields(items: T[], fields: keyof T[]): T[] {
        return items;
    }

    private sliceItems(items: T[], offset: number, limit: number): T[] {
        return items;
    }
}