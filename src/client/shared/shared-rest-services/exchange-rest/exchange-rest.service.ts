import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExchangeEntity} from '../../../../dao/exchange/exchange.entity';
import {map} from 'rxjs/operators';
import {deserialize} from 'serializer.ts/Serializer';

@Injectable({
    providedIn: 'root'
})
export class ExchangeRestService {

    constructor(private http: HttpClient) {
    }

    getByUuid(uuid: string): Observable<ExchangeEntity> {
        return this.http.get(`/api/exchange/${uuid}`,
            {
                responseType: 'text'
            })
            .pipe(
                map(jsonText => deserialize(ExchangeEntity, jsonText))
            );
    }

}
