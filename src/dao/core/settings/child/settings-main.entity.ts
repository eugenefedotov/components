import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('settings_main')
export class SettingsMainEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;
}