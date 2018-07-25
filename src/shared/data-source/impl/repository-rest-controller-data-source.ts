import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {BodyParams, Post} from '@tsed/common';

export abstract class RepositoryRestControllerDataSource<T> {

    protected constructor(private dataSource: DataSource<T>) {

    }

    @Post('/get-data')
    getData(@BodyParams() request: DataSourceRequestModel<T>): Promise<DataSourceResponseModel<T>> {
        return this.dataSource.getData(request).toPromise();
    }
}
