import {EntityRepository, Repository} from 'typeorm';
import {PaymentServiceRequisiteTypeEntity} from './payment-service-requisite-type.entity';

@EntityRepository(PaymentServiceRequisiteTypeEntity)
export class PaymentServiceRequisiteTypeRepository extends Repository<PaymentServiceRequisiteTypeEntity> {

}