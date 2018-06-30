import {SelectSource} from '../select-source';
import {SelectItemModel} from '../models/select-item.model';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {DataSource} from '../../data-source/data-source';
import {DataSourceRequestModel} from '../../data-source/models/data-source-request.model';
import {DataSourceRequestFilterTypeEnum} from '../../data-source/models/data-source-request-filter-type.enum';

export class RestDataSelectSource<T extends SelectItemModel = SelectItemModel> implements SelectSource<T> {

    private fields: (keyof T)[] = ['id', 'name'];

    constructor(private restDataSource: DataSource<T>,
                private filterKey: keyof T = 'name') {

    }

    async getById(id: T['id']): Promise<T> {

        const restDataRequest: DataSourceRequestModel<T> = {
            offset: 0,
            limit: 1,
            fields: this.fields,
            filter: [
                {
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    field: 'id',
                    values: [id]
                }
            ]
        };

        const result = await this.restDataSource.getData(restDataRequest);

        return result.items.length ? result[0] : void 0;
    }

    async getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>> {
        const restDataRequest: DataSourceRequestModel<T> = {
            offset: request.offset,
            limit: request.limit,
            fields: this.fields,
            filter: []
        };

        if (request.filter) {
            restDataRequest.filter.push({
                field: this.filterKey,
                type: DataSourceRequestFilterTypeEnum.Contains,
                values: [request.filter]
            });
        }

        const result = await this.restDataSource.getData(restDataRequest);

        return {
            count: result.count,
            items: result.items
        };
    }
}
