import {DataSource} from '../data-source';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {Brackets, Repository, SelectQueryBuilder, WhereExpression} from 'typeorm';
import {DataSourceRequestFilterTypeEnum} from '../models/data-source-request-filter-type.enum';
import {DataSourceRequestSortModel} from '../models/data-source-request-sort.model';
import {DataSourceRequestSortOrderEnum} from '../models/data-source-request-sort-order.enum';
import {DataSourceRequestFilterItemModel} from '../models/data-source-request-filter-item.model';
import {Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map, switchMap} from 'rxjs/operators';

export class RepositoryDataSource<T> implements DataSource<T> {
    private alias = 'entity';

    constructor(private repository: Repository<T>, private middleware?: (qb: SelectQueryBuilder<T>) => void) {
    }

    private get fields() {
        return this.repository.metadata.columns.map(column => column.propertyName);
    }

    private get primaryFields() {
        return this.repository.metadata.primaryColumns.map(md => this.getPropertyName(md.propertyName));
    }

    getData(request: DataSourceRequestModel<T>): Observable<DataSourceResponseModel<T>> {
        const qb = this.repository.createQueryBuilder(this.alias);

        if (this.middleware) {
            this.middleware(qb);
        }

        if (request.filter) {
            this.addFilter(qb, request.filter);
        }

        if (request.sort) {
            this.addSort(qb, request.sort);
        }

        if (request.offset || request.limit) {
            console.log(request);
            this.addOffsetAndLimit(qb, request.offset, request.limit);
        }

        qb.select(this.primaryFields);

        if (request.fields) {
            request.fields.forEach(field => {
                if (!this.fields.includes(field)) {
                    throw new Error(`field ${field} non exists`);
                }
            });
        }

        return fromPromise(qb.getManyAndCount())
            .pipe(
                switchMap(result => this.loadItemsWithRelations(request, {
                    items: result[0],
                    count: result[1]
                }))
            );
    }

    private addFilter(qb: SelectQueryBuilder<T>, filters: DataSourceRequestFilterItemModel<T>[]) {
        filters.forEach(filter => {
            qb.andWhere(new Brackets(qb1 => {
                this.addFilterByField(qb1, filter);
            }));
        });
    }

    private addFilterByField<P extends keyof T>(qb: WhereExpression, filterElement: DataSourceRequestFilterItemModel<T>) {
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
            qb.skip(offset);
        }

        if (limit) {
            qb.take(limit);
        }
    }

    private getPropertyName(field: keyof T | string) {
        if (!this.fields.includes(field as string)) {
            throw new Error(`field ${field} non exists`);
        }

        const dbColumnName = this.propertyToFieldName(field);

        return `${this.alias}.${dbColumnName}`;
    }

    private propertyToFieldName(field: keyof T | string) {
        for (const column of this.repository.metadata.columns) {
            if (column.propertyName === field) {
                // console.log(column);
                return column.databaseName;
            }
        }

        return field;
    }

    private loadItemsWithRelations(request: DataSourceRequestModel<T>, result: DataSourceResponseModel<T>): Observable<DataSourceResponseModel<T>> {
        if (result.items.length) {
            return fromPromise(this.repository.find({
                where: result.items,
                select: request.fields
            }))
                .pipe(
                    map((items) => ({
                        items,
                        count: result.count
                    }))
                );
        }

        return of(result);
    }
}
