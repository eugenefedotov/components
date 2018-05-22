import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('settings_file_storage')
export class SettingsFileStorageEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({unsigned: true, nullable: true})
    maxUploadFileSize: number;
}