import {ListSource} from '../list-source';
import {ListSourceRequestModel} from '../models/list-source-request.model';
import {Observable} from 'rxjs';
import {ListSourceResponseModel} from '../models/list-source-response.model';
import {map} from 'rxjs/operators';

export class SlicedListSource<T> implements ListSource<T> {

    constructor(private listSource: ListSource<T>,
                private offsetStart: number,
                private offsetEnd: number) {

    }

    getData(request: ListSourceRequestModel): Observable<ListSourceResponseModel<T>> {
        return this.listSource.getData({
            offset: request.offset + this.offsetStart,
            limit: request.limit
        })
            .pipe(
                map(resp => ({
                        ...resp,
                        count: resp.count - this.offsetStart - this.offsetEnd
                    })
                )
            );
    }
}
