import {EntityRepository, Repository} from "typeorm";
import {FileMetadataEntity} from "./file-metadata.entity";

@EntityRepository(FileMetadataEntity)
export class FileMetadataRepository extends Repository<FileMetadataEntity> {

}
