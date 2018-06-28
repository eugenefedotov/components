import {EntityRepository, Repository} from 'typeorm';
import {PaymentServiceAccountEntity} from './payment-service-account.entity';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';

@EntityRepository(PaymentServiceAccountEntity)
export class PaymentServiceAccountRepository extends Repository<PaymentServiceAccountEntity> {

  getEnabledByPaymentService(paymentService: PaymentServiceEntity): Promise<PaymentServiceAccountEntity[]> {
    return this.find({
      where: {
        paymentService: paymentService,
        isEnabled: true
      }
    });
  }

}
