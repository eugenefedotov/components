import {EntityRepository, Repository} from 'typeorm';
import {SettingsEntity} from './settings.entity';

@EntityRepository(SettingsEntity)
export class SettingsRepository extends Repository<SettingsEntity> {

}
