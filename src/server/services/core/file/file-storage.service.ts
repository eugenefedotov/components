import {FileServerEntity} from '../../../../dao/core/file-storage/file-server/file-server.entity';
import {FileMetadataEntity} from '../../../../dao/core/file-storage/file-metadata/file-metadata.entity';
import {Connection, ConnectionOptions} from 'webdav-client';
import {FileOnServerEntity} from '../../../../dao/core/file-storage/file-on-server/file-on-server.entity';
import {FileOnServerRepository} from '../../../../dao/core/file-storage/file-on-server/file-on-server.repository';
import {Service} from '@tsed/common';
import {getCustomRepository} from 'typeorm';

@Service()
export class FileStorageService {
    private fileOnServerRepository = getCustomRepository(FileOnServerRepository);

    async put(server: FileServerEntity, file: FileMetadataEntity, content: any): Promise<FileOnServerEntity> {
        const connection = this.getConnection(server);

        await new Promise<void>((resolve, reject) => {
            connection.put(this.getFilePath(file), content, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        const fileOnServer = this.fileOnServerRepository.create({
            status: 'available',
            file: file,
            server: server
        });

        return this.fileOnServerRepository.save(fileOnServer);
    }

    async get(fileOnServerEntity: FileOnServerEntity): Promise<any> {
        const connection = this.getConnection(fileOnServerEntity.server);

        return new Promise<any>((resolve, reject) => {
            connection.get(this.getFilePath(fileOnServerEntity.file), (error, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }

    private getFilePath(file: FileMetadataEntity): string {
        const pathArr: string[] = [];

        pathArr.push(file.md5.slice(0, 2));
        pathArr.push(file.md5.slice(2, 4));

        pathArr.push(file.md5);

        return pathArr.join('/');
    }

    private getConnection(server: FileServerEntity): Connection {
        return new Connection(<ConnectionOptions>{
            url: server.url,
            username: server.username,
            password: server.password
        });
    }
}