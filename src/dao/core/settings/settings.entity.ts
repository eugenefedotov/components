import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {SettingsAuthenticationEntity} from './child/settings-authentication.entity';
import {SettingsRegistrationEntity} from './child/settings-registration.entity';
import {SettingsMainEntity} from './child/settings-main.entity';
import {SettingsFileStorageEntity} from './child/settings-file-storage.entity';
import {jsonIgnore} from 'json-ignore';
import {SettingsPrivateEntity} from './child/settings-private.entity';

@Entity('settings')
export class SettingsEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => SettingsMainEntity, {eager: true, cascade: true})
    @JoinColumn()
    main: SettingsMainEntity;

    @OneToOne(type => SettingsFileStorageEntity, {eager: true, cascade: true})
    @JoinColumn()
    fileStorage: SettingsFileStorageEntity;

    @OneToOne(type => SettingsAuthenticationEntity, {eager: true, cascade: true})
    @JoinColumn()
    authentication: SettingsAuthenticationEntity;

    @OneToOne(type => SettingsRegistrationEntity, {eager: true, cascade: true})
    @JoinColumn()
    registration: SettingsRegistrationEntity;

    @OneToOne(type => SettingsPrivateEntity, {eager: true, cascade: true})
    @JoinColumn()
    @jsonIgnore()
    private: SettingsPrivateEntity;
}