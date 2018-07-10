import {Controller} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {RepositoryRestControllerDataSource} from '../../../shared/data-source/impl/repository-rest-controller-data-source';
import {PaymentServiceRepository} from '../../../dao/payment-service/payment-service.repository';
import {PaymentServiceEntity} from '../../../dao/payment-service/payment-service.entity';

@Controller('/payment-service')
export class PaymentServiceController extends RepositoryRestControllerDataSource<PaymentServiceEntity> {
    constructor() {
        super(getCustomRepository(PaymentServiceRepository));
    }
}
