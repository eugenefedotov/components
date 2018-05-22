import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('settings_main')
export class SettingsMainEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    title: string;

    @Column()
    subtitle: string;
}