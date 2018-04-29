import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {FileServerEntity} from "../file-server/file-server.entity";
import {FileMetadataEntity} from "../file-metadata/file-metadata.entity";

@Entity('file_on_server')
export class FileOnServerEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @ManyToOne(type => FileMetadataEntity)
    file: FileMetadataEntity;

    @ManyToOne(type => FileServerEntity)
    server: FileServerEntity;

    @Column({type: "enum", enum: ['uploading', 'available', 'error']})
    status: 'uploading' | 'available' | 'error';

    @Column('timestamp')
    lastCheckDate: Date;

    @Column()
    error: string;
}