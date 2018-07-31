import {PaymentServiceCurrencyRepository} from '../../../dao/payment-service-currency/payment-service-currency.repository';
import {getCustomRepository} from 'typeorm';
import {Controller} from '@tsed/common';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {RepositoryRestControllerDataSource} from '../../../shared/classes/data-source/impl/repository-rest-controller-data-source';
import {RepositoryDataSource} from '../../../shared/classes/data-source/impl/repository-data-source';

@Controller('/payment-service-currency')
export class PaymentServiceCurrencyController extends RepositoryRestControllerDataSource<PaymentServiceCurrencyEntity> {
    constructor() {
        const ds = new RepositoryDataSource(getCustomRepository(PaymentServiceCurrencyRepository), qb => {
            qb.innerJoin('entity.currency', 'currency');
            qb.innerJoin('entity.paymentService', 'paymentService');
            qb.andWhere('currency.isEnabled = :isEnabled', {isEnabled: true});
            qb.andWhere('paymentService.isEnabled = :isEnabled', {isEnabled: true});
        });

        super(ds);
    }
}
