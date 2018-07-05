import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';

export class LocalListSource<T> implements ListSource<T> {

    constructor(private items: T[]) {

    }


    async getData(offset: number, limit: number): Promise<ListSourceResponseModel<T>> {
        return {
            count: this.items.length,
            items: this.items.slice(offset, offset + limit)
        };
    }
}
