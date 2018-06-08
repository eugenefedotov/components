import {SelectSource} from '../select-source';
import {SelectItemModel} from '../models/select-item.model';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {RestDataSource} from '../../rest-data/rest-data-source';
import {RestDataRequestModel} from '../../rest-data/models/rest-data-request.model';
import {RestDataRequestFilterTypeEnum} from '../../rest-data/models/rest-data-request-filter-type.enum';
import {RestDataRequestFilterItemModel} from '../../rest-data/models/rest-data-request-filter-item.model';

export class RestDataSelectSource<T extends SelectItemModel = SelectItemModel> implements SelectSource<T> {

    constructor(private restDataSource: RestDataSource<T>,
                private filterKey: keyof T = 'name') {

    }

    async getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>> {
        const restDataRequest: RestDataRequestModel<T> = {
            offset: request.offset,
            limit: request.limit,
            filter: {}
        };

        if (request.filter) {
            restDataRequest.filter[this.filterKey] = <RestDataRequestFilterItemModel<T[any]>>{
                type: RestDataRequestFilterTypeEnum.Contains,
                values: request.filter
            };
        }

        const result = await this.restDataSource.getResult(restDataRequest);

        return {
            count: result.count,
            items: result.items
        };
    }
}
