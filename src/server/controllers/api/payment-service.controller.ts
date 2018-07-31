import {Controller} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {RepositoryRestControllerDataSource} from '../../../shared/classes/data-source/impl/repository-rest-controller-data-source';
import {PaymentServiceRepository} from '../../../dao/payment-service/payment-service.repository';
import {PaymentServiceEntity} from '../../../dao/payment-service/payment-service.entity';
import {RepositoryDataSource} from '../../../shared/classes/data-source/impl/repository-data-source';
import {PersistentFilterDataSource} from '../../../shared/classes/data-source/impl/persistent-filter-data-source';
import {DataSourceRequestFilterTypeEnum} from '../../../shared/classes/data-source/models/data-source-request-filter-type.enum';

@Controller('/payment-service')
export class PaymentServiceController extends RepositoryRestControllerDataSource<PaymentServiceEntity> {
    constructor() {
        const ds = new RepositoryDataSource(getCustomRepository(PaymentServiceRepository));

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
