import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {DataSource} from '../../data-source/data-source';
import {DataSourceRequestFilterItemModel} from '../../data-source/models/data-source-request-filter-item.model';
import {ListSourceRequestModel} from '../models/list-source-request.model';

export class DataSourceListSource<T> implements ListSource<T> {

    constructor(private restDataSource: DataSource<T>,
                private filter: DataSourceRequestFilterItemModel<T>[] = []
    ) {

    }

    getData(request: ListSourceRequestModel): Promise<ListSourceResponseModel<T>> {
        return this.restDataSource.getData({
            filter: this.filter,
            offset: request.offset,
            limit: request.limit
        });
    }
}
