import {EntityRepository, Repository} from "typeorm";
import {FileServerEntity} from "./file-server.entity";

@EntityRepository(FileServerEntity)
export class FileServerRepository extends Repository<FileServerEntity> {

}