import {SelectSource} from '../select-source';
import {SelectItemModel} from '../models/select-item.model';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {RestDataSource} from '../../rest-data/rest-data-source';

export class RestDataSelectSource<T extends SelectItemModel = SelectItemModel, T2> implements SelectSource<T> {

    constructor(private restDataSource: RestDataSource<T2>,
                private middleware: (input: T2) => T = i => i,
                private filterKey = 'name') {

    }

    async getSlice(request: SelectSourceRequestModel): Promise<SelectSourceResponseModel<T>> {
        const result = await this.restDataSource.getResult({
            filter: {
                [this.filterKey]: request.filter
            },
            offset: request.offset,
            limit: request.limit
        });

        return {
            count: result.count,
            items: result.items.map(item => this.middleware(item))
        };
    }
}
