import {PaymentServiceCurrencyRepository} from '../../../dao/payment-service-currency/payment-service-currency.repository';
import {DataSourceResponseModel} from '../../../shared/data-source/models/data-source-response.model';
import {RepositoryDataSource} from '../../../shared/data-source/impl/repository-data-source';
import {getCustomRepository} from 'typeorm';
import {BodyParams, Controller, Post} from '@tsed/common';
import {DataSourceRequestModel} from '../../../shared/data-source/models/data-source-request.model';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {DataSource} from '../../../shared/data-source/data-source';

@Controller('/payment-service-currency')
export class PaymentServiceCurrencyController {

    private restDataSource: DataSource<PaymentServiceCurrencyEntity>;

    constructor() {
        this.restDataSource = new RepositoryDataSource(getCustomRepository(PaymentServiceCurrencyRepository));
    }

    @Post('/get')
    getItems(@BodyParams() request: DataSourceRequestModel<PaymentServiceCurrencyEntity>): Promise<DataSourceResponseModel<PaymentServiceCurrencyEntity>> {
        return this.restDataSource.getData(request);
    }
}
