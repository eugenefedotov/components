import {Injectable} from '@angular/core';
import {RestClientDataSource} from '../../../../shared/classes/data-source/impl/rest-client-data-source';
import {ExchangeRouteEntity} from '../../../../dao/exchange-route/exchange-route.entity';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ExchangeRouteRestService extends RestClientDataSource<ExchangeRouteEntity> {

    constructor(http: HttpClient) {
        super(http, '/api/exchange-route', ExchangeRouteEntity);
    }
}
