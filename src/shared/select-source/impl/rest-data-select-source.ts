import {SelectSource} from '../select-source';
import {SelectItemModel} from '../models/select-item.model';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {RestDataSource} from '../../rest-data/rest-data-source';
import {RestDataRequestModel} from '../../rest-data/models/rest-data-request.model';
import {RestDataRequestFilterTypeEnum} from '../../rest-data/models/rest-data-request-filter-type.enum';

export class RestDataSelectSource<T extends SelectItemModel = SelectItemModel> implements SelectSource<T> {

    private fields: (keyof T)[] = ['id', 'name'];

    constructor(private restDataSource: RestDataSource<T>,
                private filterKey: keyof T = 'name') {

    }

    async getById(id: T['id']): Promise<T> {

        const restDataRequest: RestDataRequestModel<T> = {
            offset: 0,
            limit: 1,
            fields: this.fields,
            filter: [
                {
                    type: RestDataRequestFilterTypeEnum.Equal,
                    field: 'id',
                    values: [id]
                }
            ]
        };

        const result = await this.restDataSource.getResult(restDataRequest);

        return result.items.length ? result[0] : void 0;
    }

    async getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>> {
        const restDataRequest: RestDataRequestModel<T> = {
            offset: request.offset,
            limit: request.limit,
            fields: this.fields,
            filter: []
        };

        if (request.filter) {
            restDataRequest.filter.push({
                field: this.filterKey,
                type: RestDataRequestFilterTypeEnum.Contains,
                values: [request.filter]
            });
        }

        const result = await this.restDataSource.getResult(restDataRequest);

        return {
            count: result.count,
            items: result.items
        };
    }
}
