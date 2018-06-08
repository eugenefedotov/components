import {ListSourceResponseModel} from './models/list-source-response.model';

export interface ListSource<T> {
    getItems(offset: number, limit: number): Promise<ListSourceResponseModel<T>>;
}