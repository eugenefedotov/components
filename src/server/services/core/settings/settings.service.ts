import {Service} from '@tsed/common';
import {DeepPartial, getCustomRepository} from 'typeorm';
import {SettingsRepository} from '../../../../dao/core/settings/settings.repository';
import {SettingsEntity} from '../../../../dao/core/settings/settings.entity';

@Service()
export class SettingsService {

    private settingsRepository = getCustomRepository(SettingsRepository);
    private lastSettingsPromise: Promise<SettingsEntity>;

    async get(): Promise<SettingsEntity> {
        const settings = await (this.lastSettingsPromise || (this.lastSettingsPromise = this.settingsRepository.getCurrent()));
        return this.settingsRepository.create(settings); // для иммутабельности
    }

    async set(settings: DeepPartial<SettingsEntity>): Promise<SettingsEntity> {
        return this.lastSettingsPromise = this.settingsRepository.patch(settings);
    }
}