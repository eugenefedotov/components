import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {DataSourceRequestFilterItemModel} from '../models/data-source-request-filter-item.model';

export class PersistentFilterDataSource<T> implements DataSource<T> {

    constructor(private dataSource: DataSource<T>, private filter?: DataSourceRequestFilterItemModel<T>[]) {

    }

    getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        return this.dataSource.getData({
            ...request,
            filter: [...this.filter, ...request.filter]
        });
    }

    setFilter(filter: DataSourceRequestFilterItemModel<T>[]) {
        this.filter = filter;
    }
}
