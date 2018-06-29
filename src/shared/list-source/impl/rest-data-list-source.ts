import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {RestDataSource} from '../../rest-data/rest-data-source';

export class RestDataListSource<T> implements ListSource<T> {

    constructor(private restDataSource: RestDataSource<T>) {

    }

    getItems(offset: number, limit: number): Promise<ListSourceResponseModel<T>> {
        return this.restDataSource.getResult({offset, limit});
    }
}
