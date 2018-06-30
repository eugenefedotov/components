import {DataSource} from '../data-source';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {Brackets, Repository, SelectQueryBuilder, WhereExpression} from 'typeorm';
import {DataSourceRequestFilterTypeEnum} from '../models/data-source-request-filter-type.enum';
import {DataSourceRequestSortModel} from '../models/data-source-request-sort.model';
import {DataSourceRequestSortOrderEnum} from '../models/data-source-request-sort-order.enum';
import {DataSourceRequestFilterItemModel} from '../models/data-source-request-filter-item.model';

export class RepositoryDataSource<T> implements DataSource<T> {
    private fields: string[];

    constructor(private repository: Repository<T>, private alias = 'entity') {
        this.fields = this.repository.metadata.columns.map(column => column.propertyName);
    }

    async getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
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

        return <DataSourceResponseModel<T>>{count, items};
    }

    private addFilter(qb: SelectQueryBuilder<T>, filters: DataSourceRequestFilterItemModel<T>[]) {
        filters.forEach(filter => {
            qb.andWhere(new Brackets(qb1 => {
                this.addFilterByField(qb1, filter);
            }));
        });
    }

    private addFilterByField<P extends keyof T>(qb: WhereExpression, filterElement: DataSourceRequestFilterItemModel<T, P>) {
        const field = filterElement.field;
        const filterValues: T[P][] = filterElement.values;
        const filterType: DataSourceRequestFilterTypeEnum = filterElement.type || DataSourceRequestFilterTypeEnum.Equal;

        filterValues.forEach((filterValue, index) => {
            this.addFilterByFieldValue(qb, field, filterType, filterValue, index);
        });
    }

    private addFilterByFieldValue<P extends keyof T>(qb: WhereExpression, field: keyof T, type: DataSourceRequestFilterTypeEnum, value: T[P], index: number) {

        const propName = this.getPropertyName(field);
        const paramName = `${field}_${index}`;
        const parameters = {[paramName]: value};
        switch (type) {
            case DataSourceRequestFilterTypeEnum.Equal:
                qb.orWhere(`${propName} = :${paramName}`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.Contains:
                qb.orWhere(`${propName} LIKE CONCAT('%', :${paramName}, '%')`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.StartWith:
                qb.orWhere(`${propName} LIKE CONCAT(:${paramName}, '%')`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.EndWith:
                qb.orWhere(`${propName} LIKE CONCAT('%', :${paramName})`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.LessThan:
                qb.orWhere(`${propName} < :${paramName}`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.LessThanOrEquals:
                qb.orWhere(`${propName} <= :${paramName}`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.MoreThan:
                qb.orWhere(`${propName} > :${paramName}`, parameters);
                break;
            case DataSourceRequestFilterTypeEnum.MoreThanOrEquals:
                qb.orWhere(`${propName} >= :${paramName}`, parameters);
                break;
            default:
                throw new Error(`unknown filter type: ${type} (${DataSourceRequestFilterTypeEnum[type]})`);
        }
    }

    private addSort(qb: SelectQueryBuilder<T>, sort: DataSourceRequestSortModel<T>[]) {
        sort.forEach(sortItem => {
            qb.orderBy(sortItem.field as string, sortItem.order === DataSourceRequestSortOrderEnum.Desc ? 'DESC' : 'ASC');
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