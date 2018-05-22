import {FileMetadataEntity} from '../../../../dao/core/file-storage/file-metadata/file-metadata.entity';
import {FileMetadataRepository} from '../../../../dao/core/file-storage/file-metadata/file-metadata.repository';
import {FileStorageService} from './file-storage.service';
import {FileNotFoundException} from './exceptions/file-not-found.exception';
import {FileContentNotAvailableException} from './exceptions/file-content-not-available.exception';
import {FileServerRepository} from '../../../../dao/core/file-storage/file-server/file-server-repository';
import * as path from 'path';
import * as mime from 'mime-types';
import {FileContentNotSavedException} from './exceptions/file-content-not-saved.exception';
import {md5} from '../../../../functions/md5';
import * as moment from 'moment';
import {Service} from '@tsed/common';
import {getCustomRepository} from 'typeorm';

@Service()
export class FileService {
    private fileMetadataRepository = getCustomRepository(FileMetadataRepository);
    private fileServerRepository = getCustomRepository(FileServerRepository);

    constructor(
        private fileStorageService: FileStorageService
    ) {

    }

    async persist(uuid: string): Promise<void> {
        await this.getFileMetadataByFileId(uuid); // check file
        await this.fileMetadataRepository.update(uuid, {
            expireDate: null
        });
    }

    async prolong(uuid: string): Promise<void> {
        const metadata = await this.getFileMetadataByFileId(uuid); // check file

        if (!metadata.expireDate) {
            throw new Error(`file already persistence`);
        }

        await this.fileMetadataRepository.update(uuid, {
            expireDate: moment().add('hour')
        });
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

    async getFileMetadataByFileId(uuid: string): Promise<FileMetadataEntity> {
        const metadata = this.fileMetadataRepository.findOne(uuid);

        if (!metadata) {
            throw new FileNotFoundException();
        }

        return metadata;
    }

    async getFileContent(uuid: string): Promise<any> {
        const metadata = await this.fileMetadataRepository.findOne(uuid, {relations: ['servers']});

        if (!metadata) {
            throw new FileNotFoundException();
        }

        const available = metadata.servers.filter(fos => fos.status === 'available');

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
        metadata.md5 = md5(content);
        metadata.mimeType = mime.lookup(filename);

        return metadata;
    }
}