import {GridSource} from '../grid-source';
import {Observable, of} from 'rxjs';
import {GridColumnModel} from '../models/grid-column.model';
import {LocalDataSource} from '../../data-source/impl/local-data-source';

export class LocalGridSource<T extends Object> extends LocalDataSource<T> implements GridSource<T> {

    constructor(private columns: GridColumnModel<T>[], rows: T[]) {
        super(rows);
    }

    getColumns(): Observable<GridColumnModel<T>[]> {
        return of(this.columns);
    }
}
