import {EntityRepository, Repository} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';
import {PaymentServiceCurrencyEntity} from './payment-service-currency.entity';
import {CurrencyEntity} from '../currency/currency.entity';

@EntityRepository(PaymentServiceCurrencyEntity)
export class PaymentServiceCurrencyRepository extends Repository<PaymentServiceCurrencyEntity> {

    async loadOrCreateAndSave(entity: PaymentServiceCurrencyEntity): Promise<PaymentServiceCurrencyEntity> {
        if (!entity) {
            return null;
        }

        if (entity.id) {
            return this.preload(entity);
        } else if (entity.code) {
            return this.getOrCreateByCode(entity.code);
        } else {
            throw new Error('Waiting for "id" or "code"');
        }
    }

    async getOrCreateByCode(code: string): Promise<PaymentServiceCurrencyEntity> {
        const loaded = await this.findOne({where: {code: code}});
        return loaded || this.createAndSave(code);
    }

    async createAndSave(code: string): Promise<PaymentServiceCurrencyEntity> {
        return this.save(this.create({code: code}));
    }

    getByPaymentServiceAndCurrency(paymentService: PaymentServiceEntity, currency: CurrencyEntity): Promise<PaymentServiceCurrencyEntity> {
        return this.findOne({
            where: {
                currency,
                paymentService
            }
        });
    }

}
