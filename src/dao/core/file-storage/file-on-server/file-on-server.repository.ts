import {EntityRepository, Repository} from "typeorm";
import {FileOnServerEntity} from "./file-on-server.entity";

@EntityRepository(FileOnServerEntity)
export class FileOnServerRepository extends Repository<FileOnServerEntity>{

}