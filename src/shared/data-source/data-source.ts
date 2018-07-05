import {DataSourceResponseModel} from './models/data-source-response.model';
import {DataSourceRequestModel} from './models/data-source-request.model';
import {ListSource} from '../list-source/list-source';

export interface DataSource<T> extends ListSource<T> {
    getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>>;
}
