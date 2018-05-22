import {Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {SettingsAuthenticationEntity} from './child/settings-authentication.entity';
import {SettingsRegistrationEntity} from './child/settings-registration.entity';
import {SettingsMainEntity} from './child/settings-main.entity';
import {SettingsFileStorageEntity} from './child/settings-file-storage.entity';

@Entity('settings')
export class SettingsEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => SettingsMainEntity, {eager: true, cascade: true})
    main: SettingsMainEntity;

    @OneToOne(type => SettingsFileStorageEntity, {eager: true, cascade: true})
    fileStorage: SettingsFileStorageEntity;

    @OneToOne(type => SettingsAuthenticationEntity, {eager: true, cascade: true})
    authentication: SettingsAuthenticationEntity;

    @OneToOne(type => SettingsRegistrationEntity, {eager: true, cascade: true})
    registration: SettingsRegistrationEntity;
}