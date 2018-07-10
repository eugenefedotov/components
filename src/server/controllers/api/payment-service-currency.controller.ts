import {PaymentServiceCurrencyRepository} from '../../../dao/payment-service-currency/payment-service-currency.repository';
import {getCustomRepository} from 'typeorm';
import {Controller} from '@tsed/common';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {RepositoryRestControllerDataSource} from '../../../shared/data-source/impl/repository-rest-controller-data-source';

@Controller('/payment-service-currency')
export class PaymentServiceCurrencyController extends RepositoryRestControllerDataSource<PaymentServiceCurrencyEntity> {
    constructor() {
        super(getCustomRepository(PaymentServiceCurrencyRepository));
    }
}
