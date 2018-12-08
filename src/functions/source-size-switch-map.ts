import {ListSource} from '../shared/classes/list-source/list-source';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export function sourceSizeSwitchMap<T>(source: ListSource<T>): Observable<number> {
    return source.getData({
        offset: 0,
        limit: 0
    })
        .pipe(
            map(result => result.count)
        );
}
