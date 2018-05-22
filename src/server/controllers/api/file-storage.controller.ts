import {Controller, Get, PathParams} from '@tsed/common';
import {FileService} from '../../services/core/file/file.service';

@Controller('/file-storage')
export class FileStorageController {

    constructor(private fileService: FileService) {

    }

    @Get('/:uuid/metadata')
    async getFileMetadata(@PathParams('uuid') uuid: string) {
        return this.fileService.getFileMetadataByFileId(uuid);
    }

    @Get('/:uuid/content')
    async getFileContent(@PathParams('uuid') uuid: string) {
        return this.fileService.getFileContent(uuid);
    }

}