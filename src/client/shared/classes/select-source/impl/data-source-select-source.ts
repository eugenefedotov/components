import {SelectSource} from '../select-source';
import {SelectItemModel} from '../models/select-item.model';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {DataSource} from '../../data-source/data-source';
import {DataSourceRequestModel} from '../../data-source/models/data-source-request.model';
import {DataSourceRequestFilterTypeEnum} from '../../data-source/models/data-source-request-filter-type.enum';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class DataSourceSelectSource<T extends object> implements SelectSource<T> {

    constructor(private dataSource: DataSource<T>,
                private nameKey = 'name' as keyof T,
                private valueKey = 'id' as keyof T) {

    }

    getByValue(value: SelectItemModel['value']): Observable<SelectItemModel<T>> {

        const dataSourceRequestModel: DataSourceRequestModel<T> = {
            offset: 0,
            limit: 1,
            fields: [this.nameKey, this.valueKey],
            filter: [
                {
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    field: this.valueKey,
                    values: [value]
                }
            ]
        };

        return this.dataSource.getData(dataSourceRequestModel)
            .pipe(
                map(result => result.items.length ? this.mapItem(result.items[0]) : void 0)
            );
    }

    getData(request: SelectSourceRequestModel): Observable<SelectSourceResponseModel<T>> {
        const restDataRequest: DataSourceRequestModel<T> = {
            offset: request.offset,
            limit: request.limit,
            fields: [this.nameKey, this.valueKey],
            filter: []
        };

        if (request.filter) {
            restDataRequest.filter.push({
                field: this.nameKey,
                type: DataSourceRequestFilterTypeEnum.Contains,
                values: [request.filter]
            });
        }

        return this.dataSource.getData(restDataRequest)
            .pipe(
                map(result => {
                    return {
                        count: result.count,
                        items: result.items.map(item => this.mapItem(item))
                    };
                })
            );
    }

    private mapItem(item: T): SelectItemModel<T> {
        return {
            name: item[this.nameKey] as any,
            value: item[this.valueKey] as any,
            attributes: item
        } as SelectItemModel<T>;
    }
}
