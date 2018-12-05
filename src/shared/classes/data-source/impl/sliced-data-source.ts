import {DataSource} from '../data-source';
import {DataSourceResponseModel} from '../models/data-source-response.model';
import {Observable} from 'rxjs';
import {DataSourceRequestModel} from '../models/data-source-request.model';
import {map} from 'rxjs/operators';

export class SlicedDataSource<T> implements DataSource<T> {

    constructor(private dataSource: DataSource<T>,
                private offsetStart: number,
                private offsetEnd: number) {
    }

    getData(request: DataSourceRequestModel<T>): Observable<DataSourceResponseModel<T>> {
        return this.dataSource.getData({
            ...request,
            offset: request.offset + this.offsetStart,
            limit: request.limit
        })
            .pipe(
                map(resp => ({
                        ...resp,
                        count: Math.min(resp.count, this.offsetEnd - this.offsetStart)
                    })
                )
            );
    }
}
