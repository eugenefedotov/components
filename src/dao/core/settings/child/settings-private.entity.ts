import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SettingsPrivateEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    salt: string;
}