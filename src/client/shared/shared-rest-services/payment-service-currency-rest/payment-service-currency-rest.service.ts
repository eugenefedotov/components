import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RestDataSource} from '../../../../shared/rest-data/rest-data-source';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {RestDataRequestModel} from '../../../../shared/rest-data/models/rest-data-request.model';
import {RestDataResponseModel} from '../../../../shared/rest-data/models/rest-data-response.model';

const API_URL = 'api/payment-service-currency';

@Injectable({
    providedIn: 'root'
})
export class PaymentServiceCurrencyRestService implements RestDataSource<PaymentServiceCurrencyEntity> {

    constructor(private http: HttpClient) {
    }

    getResult(request: RestDataRequestModel<PaymentServiceCurrencyEntity>): Promise<RestDataResponseModel<PaymentServiceCurrencyEntity>> {
        return this.http.post<RestDataResponseModel<PaymentServiceCurrencyEntity>>(`${API_URL}/get`, request).toPromise();
    }
}
