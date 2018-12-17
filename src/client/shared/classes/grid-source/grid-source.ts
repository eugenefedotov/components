import {DataSource} from '../data-source/data-source';
import {Observable} from 'rxjs';
import {GridColumnModel} from './models/grid-column.model';

export interface GridSource<T extends Object = any> extends DataSource<T> {
    getColumns(): Observable<GridColumnModel<T>[]>;
}
