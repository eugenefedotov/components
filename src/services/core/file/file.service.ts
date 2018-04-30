import {Service} from "typedi";
import {FileMetadataEntity} from "../../../dao/core/file-storage/file-metadata/file-metadata.entity";
import {OrmRepository} from "typeorm-typedi-extensions";
import {FileMetadataRepository} from "../../../dao/core/file-storage/file-metadata/file-metadata.repository";
import {FileStorageService} from "./file-storage.service";

@Service()
export class FileService {

    constructor(
        @OrmRepository() private fileMetadataRepository: FileMetadataRepository,
        private fileStorageService: FileStorageService
    ) {

    }

    async getFileMetadataByFileId(id: number): Promise<FileMetadataEntity> {
        return this.fileMetadataRepository.findOne(id);
    }

    async getFileContent(id: number): Promise<any> {
        const metadata = await this.fileMetadataRepository.findOne(id, {relations: ['servers']});

        if (!metadata) {
            throw new Error(`file not found`);
        }

        const available = metadata.servers.filter(fos => fos.status === "available");

        for (let i = 0; i < available.length; i++) {
            try {
                return this.fileStorageService.get(available[i].server, metadata);
            } catch (e) {
            }
        }

        throw new Error(`the contents of the file is temporarily unavailable`);
    }

}