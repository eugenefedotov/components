import {DeepPartial, EntityRepository, Repository} from 'typeorm';
import {SettingsEntity} from './settings.entity';

@EntityRepository(SettingsEntity)
export class SettingsRepository extends Repository<SettingsEntity> {

    async getCurrent(): Promise<SettingsEntity> {
        return this.findOne({order: {id: 'DESC'}});
    }

    async patch(partialSettings: DeepPartial<SettingsEntity>): Promise<SettingsEntity> {
        const settings = this.create(this.merge(await this.getCurrent(), partialSettings));
        return this.save(settings);
    }
}