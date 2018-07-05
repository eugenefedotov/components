import {ListSourceResponseModel} from './models/list-source-response.model';
import {ListSourceRequestModel} from './models/list-source-request.model';

export interface ListSource<T> {
    getData(request: ListSourceRequestModel): Promise<ListSourceResponseModel<T>>;
}
