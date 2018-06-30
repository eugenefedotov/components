import {DataSourceResponseModel} from './models/data-source-response.model';
import {DataSourceRequestModel} from './models/data-source-request.model';

export interface DataSource<T> {
    getData(request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>>;
}
