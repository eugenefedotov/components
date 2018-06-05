import {RestDataResponseModel} from './rest-data-response.model';
import {RestDataRequestModel} from './rest-data-request.model';

export interface RestDataSource<T> {
    getResult(request: RestDataRequestModel<T>): RestDataResponseModel<T>
}