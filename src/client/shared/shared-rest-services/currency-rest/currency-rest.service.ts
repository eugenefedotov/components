import {Injectable} from '@angular/core';
import {CurrencyEntity} from '../../../../dao/currency/currency.entity';
import {HttpClient} from '@angular/common/http';
import {RestClientDataSource} from '../../../../shared/data-source/impl/rest-client-data-source';

@Injectable({
    providedIn: 'root'
})
export class CurrencyRestService extends RestClientDataSource<CurrencyEntity> {
    constructor(http: HttpClient) {
        super(http, 'api/currency');
    }
}
