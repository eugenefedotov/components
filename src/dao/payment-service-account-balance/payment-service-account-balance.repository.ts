import {EntityRepository, Repository} from 'typeorm';
import {PaymentServiceAccountBalanceEntity} from './payment-service-account-balance.entity';
import {PaymentServiceCurrencyEntity} from '../payment-service-currency/payment-service-currency.entity';

@EntityRepository(PaymentServiceAccountBalanceEntity)
export class PaymentServiceAccountBalanceRepository extends Repository<PaymentServiceAccountBalanceEntity> {

    /**
     * Поиск баланса в аккаунте платежного сервиса (с наибольшей суммой) по валюте платежного сервиса
     */
    async findByPaymentServiceCurrencyEntity(paymentServiceCurrencyEntity: PaymentServiceCurrencyEntity): Promise<PaymentServiceAccountBalanceEntity> {
        const requisite = await this.createQueryBuilder('b')
            .innerJoin('b.account', 'psa')
            .innerJoin('psa.paymentService', 'ps')
            .andWhere('psa.isEnabled = 1')
            .andWhere('ps.isEnabled = 1')
            .andWhere('ps.code = :paymentServiceCode', {paymentServiceCode: paymentServiceCurrencyEntity.paymentService.code})
            .andWhere('b.currency = :currencyId', {currencyId: paymentServiceCurrencyEntity.currency.id})
            .orderBy('b.amount', 'DESC')
            .getOne();

        if (!requisite) {
            return;
        }

        return this.findOne(requisite.id);
    }

    async getPositiveBalances(isReal: boolean): Promise<PaymentServiceAccountBalanceEntity[]> {
        const psab = await this.createQueryBuilder('balance')
            .innerJoin('balance.account', 'payment_service_account')
            .innerJoin('balance.currency', 'currency')
            .innerJoin('payment_service_account.paymentService', 'payment_service')
            .where('payment_service.isEnabled = 1')
            .andWhere('payment_service.isReal = :isReal', {isReal})
            .andWhere('payment_service_account.isEnabled = 1')
            .andWhere('balance.amount > 0')
            .getMany();

        return this.findByIds(psab.map(p => p.id));
    }

}
