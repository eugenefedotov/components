import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {DataSource} from '../../data-source/data-source';

export class RestDataListSource<T> implements ListSource<T> {

    constructor(private restDataSource: DataSource<T>) {

    }

    getItems(offset: number, limit: number): Promise<ListSourceResponseModel<T>> {
        return this.restDataSource.getData({offset, limit});
    }
}
