import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('settings_registration')
export class SettingsRegistrationEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    isEnabled: boolean;

    @Column()
    isEmailConfirmRequired: boolean;
}