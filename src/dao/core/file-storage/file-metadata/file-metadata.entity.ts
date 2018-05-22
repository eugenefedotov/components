import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../auth/user/user.entity";
import {FileOnServerEntity} from "../file-on-server/file-on-server.entity";

@Entity('file_metadata')
export class FileMetadataEntity {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @ManyToOne(type => UserEntity, {eager: true})
    user: UserEntity;

    @Column()
    md5: string;

    @Column({nullable: false})
    name: string;

    @Column()
    ext: string;

    @Column({nullable: true})
    mimeType: string;

    @Column({unsigned: true})
    size: number;

    @Column()
    isPublic: boolean;

    @Column({type: 'timestamp', nullable: true})
    expireDate: Date;

    @OneToMany(type => FileOnServerEntity, object => object.file)
    servers: FileOnServerEntity[];
}