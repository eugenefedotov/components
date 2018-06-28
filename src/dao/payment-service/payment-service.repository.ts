import {EntityRepository, Repository} from 'typeorm';
import {PaymentServiceEntity} from './payment-service.entity';

@EntityRepository(PaymentServiceEntity)
export class PaymentServiceRepository extends Repository<PaymentServiceEntity> {

    async loadOrCreateAndSave(entity: PaymentServiceEntity): Promise<PaymentServiceEntity> {
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

    async getOrCreateByCode(code: string): Promise<PaymentServiceEntity> {
        const loaded = await this.findOne({where: {code: code}});
        return loaded || this.createAndSave(code);
    }

    async createAndSave(code: string): Promise<PaymentServiceEntity> {
        return this.save(this.create({code: code}));
    }

    async getEnabled(isReal: boolean): Promise<PaymentServiceEntity[]> {
        return this.find({where: {isEnabled: true, isReal: isReal}});
    }

}
