import {RestDataSource} from '../rest-data-source';
import {RestDataRequestModel} from '../rest-data-request.model';
import {RestDataResponseModel} from '../rest-data-response.model';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {RestDataRequestFilterTypeEnum} from '../rest-data-request-filter-type.enum';
import {RestDataRequestSortModel} from '../rest-data-request-sort.model';
import {RestDataRequestSortOrderEnum} from '../rest-data-request-sort-order.enum';

export class RepositoryRestDataSource<T> implements RestDataSource<T> {

    constructor(private repository: Repository<T>) {

    }

    async getResult(request: RestDataRequestModel<T>): Promise<RestDataResponseModel<T>> {
        let qb = this.repository.createQueryBuilder('entity');

        if (request.filter) {
            qb = this.addFilter(qb, request.filter);
        }

        if (request.sort) {
            qb = this.addSort(qb, request.sort);
        }

        if (request.offset || request.limit) {
            qb = this.addOffsetAndLimit(qb, request.offset, request.limit);
        }

        let [items, count] = await qb.getManyAndCount();

        if (request.fields) {
            items = this.filterFields(items, request.fields);
        }

        return <RestDataResponseModel<T>>{
            count: count,
            items: items
        };
    }

    private addFilter(qb: SelectQueryBuilder<T>, filter: { [P in keyof T]?: { type: RestDataRequestFilterTypeEnum; values: T[P] | T[P][] } | T[P] | T[P][] }) {
        // todo
        return qb;
    }

    private addSort(qb: SelectQueryBuilder<T>, sort: RestDataRequestSortModel<T>[]) {
        sort.forEach(sortItem => {
            qb = qb.orderBy(sortItem.field as string, sortItem.order === RestDataRequestSortOrderEnum.Desc ? 'DESC' : 'ASC');
        });

        return qb;
    }

    private addOffsetAndLimit(qb: SelectQueryBuilder<T>, offset: number | undefined, limit: number | undefined) {
        if (offset) {
            qb = qb.offset(offset);
        }

        if (limit) {
            qb = qb.limit(limit);
        }

        return qb;
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
}