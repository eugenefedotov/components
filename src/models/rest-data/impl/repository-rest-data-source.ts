import {RestDataSource} from '../rest-data-source';
import {RestDataRequestModel} from '../rest-data-request.model';
import {RestDataResponseModel} from '../rest-data-response.model';
import {Repository} from 'typeorm';

export class RepositoryRestDataSource<T> implements RestDataSource<T> {

    constructor(private repository: Repository<T>) {

    }

    getResult(request: RestDataRequestModel<T>): RestDataResponseModel<T> {
        return undefined;
    }

}