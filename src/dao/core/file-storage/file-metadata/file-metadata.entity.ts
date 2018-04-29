import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../auth/user/user.entity";
import {FileServerEntity} from "../file-server/file-server.entity";

@Entity('file_metadata')
export class FileMetadataEntity {

    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @ManyToOne(type => UserEntity)
    insertUser: UserEntity;

    @Column({nullable: false})
    name: string;

    @Column()
    ext: string;

    @Column({nullable: true})
    mimeType: string;

    @Column()
    size: number;

    @ManyToMany(type => FileServerEntity)
    @JoinTable()
    servers: FileServerEntity[];
}