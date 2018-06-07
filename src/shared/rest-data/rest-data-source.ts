import {RestDataResponseModel} from './models/rest-data-response.model';
import {RestDataRequestModel} from './models/rest-data-request.model';

export interface RestDataSource<T> {
    getResult(request: RestDataRequestModel<T>): Promise<RestDataResponseModel<T>>;
}