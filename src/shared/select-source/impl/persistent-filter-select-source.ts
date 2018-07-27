import {SelectSource} from '../select-source';
import {SelectSourceRequestModel} from '../models/select-source-request.model';
import {SelectItemModel} from '../models/select-item.model';
import {Observable} from 'rxjs';
import {SelectSourceResponseModel} from '../models/select-source-response.model';

export class PersistentFilterSelectSource<T> implements SelectSource<T> {
    constructor(private selectSource: SelectSource<T>,
                private filter: string) {

    }

    getByValue(id: number | string): Observable<SelectItemModel<T>> {
        return this.selectSource.getByValue(id);
    }

    getData(request: SelectSourceRequestModel): Observable<SelectSourceResponseModel<T>> {
        return this.selectSource.getData({...request, filter: this.filter});
    }
}
