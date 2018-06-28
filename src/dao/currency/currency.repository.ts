import {EntityRepository, Repository} from 'typeorm';
import {CurrencyEntity} from './currency.entity';

@EntityRepository(CurrencyEntity)
export class CurrencyRepository extends Repository<CurrencyEntity> {

    async loadOrCreateAndSave(entity: CurrencyEntity): Promise<CurrencyEntity> {
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

    async getOrCreateByCode(code: string): Promise<CurrencyEntity> {
        const loaded = await this.findOne({where: {code: code}});
        return loaded || this.createAndSave(code);
    }

    async createAndSave(code: string): Promise<CurrencyEntity> {
        return this.save(this.create({code: code}));
    }

}
