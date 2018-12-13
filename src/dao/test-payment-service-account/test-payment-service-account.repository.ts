import {EntityRepository, Repository} from 'typeorm';
import {TestPaymentServiceAccountEntity} from './test-payment-service-account.entity';

@EntityRepository(TestPaymentServiceAccountEntity)
export class TestPaymentServiceAccountRepository extends Repository<TestPaymentServiceAccountEntity> {

}
