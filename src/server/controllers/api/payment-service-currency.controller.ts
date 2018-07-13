import {PaymentServiceCurrencyRepository} from '../../../dao/payment-service-currency/payment-service-currency.repository';
import {getCustomRepository} from 'typeorm';
import {Controller} from '@tsed/common';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {RepositoryRestControllerDataSource} from '../../../shared/data-source/impl/repository-rest-controller-data-source';
import {RepositoryDataSource} from '../../../shared/data-source/impl/repository-data-source';
import {PersistentFilterDataSource} from '../../../shared/data-source/impl/persistent-filter-data-source';
import {DataSourceRequestFilterTypeEnum} from '../../../shared/data-source/models/data-source-request-filter-type.enum';

@Controller('/payment-service-currency')
export class PaymentServiceCurrencyController extends RepositoryRestControllerDataSource<PaymentServiceCurrencyEntity> {
    constructor() {
        const ds = new RepositoryDataSource(getCustomRepository(PaymentServiceCurrencyRepository));

        const fds = new PersistentFilterDataSource(ds, [
            {
                field: 'isEnabled',
                type: DataSourceRequestFilterTypeEnum.Equal,
                values: [true]
            }
        ]);

        super(fds);
    }
}
