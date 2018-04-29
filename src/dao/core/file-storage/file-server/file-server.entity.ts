import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('file_server')
export class FileServerEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    isEnabled: boolean;

    @Column()
    url: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column('timestamp')
    lastCheckDate: Date;
}