import {SelectSource} from '../select-source';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectSourceResponseModel} from '../models/select-source-response.model';
import {SelectItemModel} from '../models/select-item.model';
import {Observable, of} from 'rxjs';

export class LocalSelectSource<T = any> implements SelectSource<T> {

    constructor(private items: SelectItemModel<T>[]) {

    }

    getByValue(value: SelectItemModel['value']): Observable<SelectItemModel<T>> {
        return of(this.items.find(item => item.value === value));
    }

    getData(request: SelectSourceRequestModel): Observable<SelectSourceResponseModel<T>> {
        let items = [...this.items];

        if (request.filter) {
            items = items.filter(item => item.name.includes(request.filter));
        }

        return of({
            items: items.slice(request.offset, request.offset + request.limit),
            count: items.length
        });
    }

}
