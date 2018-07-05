import {SelectSource} from '../select-source';
import {SelectItemModel} from '../models/select-item.model';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {DataSource} from '../../data-source/data-source';
import {DataSourceRequestModel} from '../../data-source/models/data-source-request.model';
import {DataSourceRequestFilterTypeEnum} from '../../data-source/models/data-source-request-filter-type.enum';

export class DataSourceSelectSource<T extends object, T2 extends SelectItemModel<T> = SelectItemModel<T>> implements SelectSource<T2> {

    constructor(private restDataSource: DataSource<T>,
                private nameKey = 'name' as keyof T,
                private valueKey = 'id' as keyof T) {

    }

    async getByValue(value: T2['value']): Promise<T2> {

        const restDataRequest: DataSourceRequestModel<T> = {
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

        const result = await this.restDataSource.getData(restDataRequest);

        return result.items.length ? this.mapItem(result.items[0]) : void 0;
    }

    async getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T2>> {
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

        const result = await this.restDataSource.getData(restDataRequest);

        return {
            count: result.count,
            items: result.items.map(item => this.mapItem(item))
        };
    }

    private mapItem(item: T): T2 {
        return {
            name: item[this.nameKey] as any,
            value: item[this.valueKey] as any,
            attributes: item
        } as T2;
    }
}
