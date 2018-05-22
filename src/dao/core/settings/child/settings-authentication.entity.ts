import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('settings_authentication')
export class SettingsAuthenticationEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    isEnabled: boolean;
}