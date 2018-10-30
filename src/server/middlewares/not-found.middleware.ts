import {Middleware, Request, Res, ServerSettingsService} from '@tsed/common';
import * as Express from 'express';

@Middleware()
export class NotFoundMiddleware {

    constructor(private serverSettingsService: ServerSettingsService) {

    }

    use(
        @Request() request: Express.Request,
        @Res() response: Express.Response
    ) {

        if (response.headersSent) {
            return;
        }

        const rootDir = this.serverSettingsService.rootDir;
        if (request.accepts('html')) {
            response.sendFile(`${rootDir}/static/index.html`);
        } else {
            // Json response
            // response.status(404).json({status: 404, message: 'Not found'});
        }

    }
}