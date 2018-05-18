import {Service} from "typedi";
import {FileMetadataEntity} from "../../../dao/core/file-storage/file-metadata/file-metadata.entity";
import {OrmRepository} from "typeorm-typedi-extensions";
import {FileMetadataRepository} from "../../../dao/core/file-storage/file-metadata/file-metadata.repository";
import {FileStorageService} from "./file-storage.service";
import {FileNotFoundException} from "./exceptions/file-not-found.exception";
import {FileContentNotAvailableException} from "./exceptions/file-content-not-available.exception";
import {FileServerRepository} from "../../../dao/core/file-storage/file-server/file-server-repository";
import * as path from "path";
import * as crypto from "crypto";
import * as mime from "mime-types";
import {FileContentNotSavedException} from "./exceptions/file-content-not-saved.exception";

@Service()
export class FileService {

    constructor(
        @OrmRepository() private fileMetadataRepository: FileMetadataRepository,
        @OrmRepository() private fileServerRepository: FileServerRepository,
        private fileStorageService: FileStorageService
    ) {

    }

    async saveFile(filename: string, content: any): Promise<FileMetadataEntity> {
        let metadata = this.createFileMetadata(filename, content);

        try {
            metadata = await this.fileMetadataRepository.save(metadata);

            const servers = await this.fileServerRepository.find({
                where: {
                    isEnabled: true
                }
            });

            let contentSaved = false;
            for (let i = 0; i < servers.length; i++) {
                const server = servers[i];

                try {
                    await this.fileStorageService.put(server, metadata, content);
                    contentSaved = true;
                    break;
                } catch (e) {
                }
            }

            if (!contentSaved) {
                throw new FileContentNotSavedException();
            }

        } catch (e) {
            this.fileMetadataRepository.remove(metadata).then();
            throw e;
        }

        return metadata;
    }

    async getFileMetadataByFileId(id: number): Promise<FileMetadataEntity> {
        const metadata = this.fileMetadataRepository.findOne(id);

        if (!metadata) {
            throw new FileNotFoundException();
        }

        return metadata;
    }

    async getFileContent(id: number): Promise<any> {
        const metadata = await this.fileMetadataRepository.findOne(id, {relations: ['servers']});

        if (!metadata) {
            throw new FileNotFoundException();
        }

        const available = metadata.servers.filter(fos => fos.status === "available");

        for (let i = 0; i < available.length; i++) {
            try {
                return this.fileStorageService.get(available[i]);
            } catch (e) {
            }
        }

        throw new FileContentNotAvailableException();
    }

    private createFileMetadata(filename: string, content: any): FileMetadataEntity {
        const metadata = this.fileMetadataRepository.create();

        metadata.ext = path.extname(filename);
        metadata.name = path.basename(filename, metadata.ext);
        metadata.size = Buffer.byteLength(content);
        metadata.md5 = crypto.createHash('md5').update(content).digest('hex');
        metadata.mimeType = mime.lookup(filename);

        return metadata;
    }
}