import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {RepositoryDataSource} from './repository-data-source';
import {BodyParams, Post} from '@tsed/common';

export abstract class RepositoryRestControllerDataSource<T> extends RepositoryDataSource<T> implements DataSource<T> {
    @Post('/get-data')
    getData(@BodyParams() request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        return super.getData(request);
    }
}
