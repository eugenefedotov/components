import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('file_server')
export class FileServerEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;
}