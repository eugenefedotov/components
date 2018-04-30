import {Service} from "typedi";
import {FileServerEntity} from "../../../dao/core/file-storage/file-server/file-server.entity";
import {FileMetadataEntity} from "../../../dao/core/file-storage/file-metadata/file-metadata.entity";
import {Connection, ConnectionOptions} from "webdav-client";

@Service()
export class FileStorageService {

    constructor() {

    }

    async put(server: FileServerEntity, file: FileMetadataEntity, content: any): Promise<void> {
        const connection = this.getConnection(server);

        return new Promise<void>((resolve, reject) => {
            connection.put(this.getFilePath(file), content,  (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async get(server: FileServerEntity, file: FileMetadataEntity): Promise<any> {
        const connection = this.getConnection(server);

        return new Promise<any>((resolve, reject) => {
            connection.get(this.getFilePath(file), (error, body) => {
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