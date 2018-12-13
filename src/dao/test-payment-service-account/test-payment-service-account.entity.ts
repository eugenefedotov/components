import {Entity} from 'typeorm';
import {PaymentServiceAccountEntity} from '../payment-service-account/payment-service-account.entity';

@Entity('test_payment_service_account')
export class TestPaymentServiceAccountEntity extends PaymentServiceAccountEntity {

}
