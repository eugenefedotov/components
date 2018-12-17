import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {Observable, of} from 'rxjs';
import {ListSourceRequestModel} from '../models/list-source-request.model';

export class LocalListSource<T> implements ListSource<T> {

    constructor(private items: T[]) {

    }

    getData(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
        return of({
            count: this.items.length,
            items: this.items.slice(request.offset, request.offset + request.limit)
        });
    }
}
