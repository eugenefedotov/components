import {Controller, Get} from '@tsed/common';

@Controller('/file-storage')
export class FileStorageController {

    @Get('/:id/metadata')
    async getFileMetadata() {

    }

    @Get('/:id/content')
    async getFileContent() {

    }

}