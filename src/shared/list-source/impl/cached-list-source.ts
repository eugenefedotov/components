import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';

export class CachedListSource<T> implements ListSource<T> {

    constructor(private listSource: ListSource<T>) {

    }


    getItems(offset: number, limit: number): Promise<ListSourceResponseModel<T>> {
        return this.listSource.getItems(offset, limit);
    }

}
