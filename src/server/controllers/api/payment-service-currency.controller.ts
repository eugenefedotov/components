import {PaymentServiceCurrencyRepository} from '../../../dao/payment-service-currency/payment-service-currency.repository';
import {RestDataResponseModel} from '../../../shared/rest-data/models/rest-data-response.model';
import {RepositoryRestDataSource} from '../../../shared/rest-data/impl/repository-rest-data-source';
import {getCustomRepository} from 'typeorm';
import {BodyParams, Controller, Post} from '@tsed/common';
import {RestDataRequestModel} from '../../../shared/rest-data/models/rest-data-request.model';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {RestDataSource} from '../../../shared/rest-data/rest-data-source';

@Controller('/payment-service-currency')
export class PaymentServiceCurrencyController {

    private restDataSource: RestDataSource<PaymentServiceCurrencyEntity>;

    constructor() {
        this.restDataSource = new RepositoryRestDataSource(getCustomRepository(PaymentServiceCurrencyRepository));
    }

    @Post('/get')
    getItems(@BodyParams() request: RestDataRequestModel<PaymentServiceCurrencyEntity>): Promise<RestDataResponseModel<PaymentServiceCurrencyEntity>> {
        return this.restDataSource.getResult(request);
    }
}
