import {ListSource} from '../list-source';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {ListSourceRequestModel} from '../models/list-source-request.model';
import {Observable} from 'rxjs';

export class CachedListSource<T> implements ListSource<T> {

    constructor(private listSource: ListSource<T>, private minRequestSize: number) {
        if (!this.listSource) {
            throw new Error('required ListSource');
        }
    }

    getData(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
       return this.listSource.getData(request);
    }
}
