import {GridSource} from '../grid-source';
import {GridColumnModel} from '../models/grid-column.model';
import {DataSource} from '../../data-source/data-source';
import {DataSourceResponseModel} from '../../data-source/models/data-source-response.model';
import {Observable, of} from 'rxjs';
import {DataSourceRequestModel} from '../../data-source/models/data-source-request.model';

export class DataSourceGridSource<T> implements GridSource<T> {
    constructor(private columns: GridColumnModel<T>[],
                private dataSource: DataSource<T>) {

    }

    getColumns(): Observable<GridColumnModel<T>[]> {
        return of(this.columns);
    }

    getData(request: DataSourceRequestModel<T>): Observable<DataSourceResponseModel<T>> {
        return this.dataSource.getData(request);
    }
}
