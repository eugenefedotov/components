import {RestDataSource} from '../rest-data-source';
import {RestDataRequestModel} from '../models/rest-data-request.model';
import {RestDataResponseModel} from '../models/rest-data-response.model';
import {Brackets, Repository, SelectQueryBuilder, WhereExpression} from 'typeorm';
import {RestDataRequestFilterTypeEnum} from '../models/rest-data-request-filter-type.enum';
import {RestDataRequestSortModel} from '../models/rest-data-request-sort.model';
import {RestDataRequestSortOrderEnum} from '../models/rest-data-request-sort-order.enum';
import {RestDataRequestFilterItemModel} from '../models/rest-data-request-filter-item.model';

export class RepositoryRestDataSource<T> implements RestDataSource<T> {
    private fields: string[];

    constructor(private repository: Repository<T>, private alias = 'entity') {
        this.fields = this.repository.metadata.columns.map(column => column.propertyName);
    }

    async getResult(request: RestDataRequestModel<T>): Promise<RestDataResponseModel<T>> {
        const qb = this.repository.createQueryBuilder(this.alias);

        if (request.filter) {
            this.addFilter(qb, request.filter);
        }

        if (request.sort) {
            this.addSort(qb, request.sort);
        }

        if (request.offset || request.limit) {
            this.addOffsetAndLimit(qb, request.offset, request.limit);
        }

        let [items, count] = await qb.getManyAndCount();

        if (request.fields) {
            items = this.filterFields(items, request.fields);
        }

        return <RestDataResponseModel<T>>{count, items};
    }

    private addFilter(qb: SelectQueryBuilder<T>, filters: RestDataRequestFilterItemModel<T>[]) {
        filters.forEach(filter => {
            qb.andWhere(new Brackets(qb1 => {
                this.addFilterByField(qb1, filter);
            }));
        });
    }

    private addFilterByField<P extends keyof T>(qb: WhereExpression, filterElement: RestDataRequestFilterItemModel<T, P>) {
        const field = filterElement.field;
        const filterValues: T[P][] = filterElement.values;
        const filterType: RestDataRequestFilterTypeEnum = filterElement.type || RestDataRequestFilterTypeEnum.Equal;

        filterValues.forEach((filterValue, index) => {
            this.addFilterByFieldValue(qb, field, filterType, filterValue, index);
        });
    }

    private addFilterByFieldValue<P extends keyof T>(qb: WhereExpression, field: keyof T, type: RestDataRequestFilterTypeEnum, value: T[P], index: number) {

        const propName = this.getPropertyName(field);
        const paramName = `${field}_${index}`;
        const parameters = {[paramName]: value};
        switch (type) {
            case RestDataRequestFilterTypeEnum.Equal:
                qb.orWhere(`${propName} = :${paramName}`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.Contains:
                qb.orWhere(`${propName} LIKE CONCAT('%', :${paramName}, '%')`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.StartWith:
                qb.orWhere(`${propName} LIKE CONCAT(:${paramName}, '%')`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.EndWith:
                qb.orWhere(`${propName} LIKE CONCAT('%', :${paramName})`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.LessThan:
                qb.orWhere(`${propName} < :${paramName}`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.LessThanOrEquals:
                qb.orWhere(`${propName} <= :${paramName}`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.MoreThan:
                qb.orWhere(`${propName} > :${paramName}`, parameters);
                break;
            case RestDataRequestFilterTypeEnum.MoreThanOrEquals:
                qb.orWhere(`${propName} >= :${paramName}`, parameters);
                break;
            default:
                throw new Error(`unknown filter type: ${type} (${RestDataRequestFilterTypeEnum[type]})`);
        }
    }

    private addSort(qb: SelectQueryBuilder<T>, sort: RestDataRequestSortModel<T>[]) {
        sort.forEach(sortItem => {
            qb.orderBy(sortItem.field as string, sortItem.order === RestDataRequestSortOrderEnum.Desc ? 'DESC' : 'ASC');
        });
    }

    private addOffsetAndLimit(qb: SelectQueryBuilder<T>, offset: number | undefined, limit: number | undefined) {
        if (offset) {
            qb.offset(offset);
        }

        if (limit) {
            qb.limit(limit);
        }
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

    private getPropertyName(field: keyof T) {
        if (!this.fields.includes(field as string)) {
            throw new Error(`field ${field} non exists`);
        }

        return `${this.alias}.${field}`;
    }
}