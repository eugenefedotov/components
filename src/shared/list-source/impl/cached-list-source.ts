import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';

export class CachedListSource<T> implements ListSource<T> {

    private cache = new Map<number, T>();

    constructor(private listSource: ListSource<T>, private minRequestSize: number) {

    }

    getItems(offset: number, limit: number): Promise<ListSourceResponseModel<T>> {
        return this.listSource.getItems(offset, limit);
    }

}
