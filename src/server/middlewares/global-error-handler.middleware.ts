import * as Express from 'express';
import {OverrideMiddleware, GlobalErrorHandlerMiddleware, Err, Req, Res} from '@tsed/common';
import {Exception} from 'ts-httpexceptions';

@OverrideMiddleware(GlobalErrorHandlerMiddleware)
export class MyGEHMiddleware {

    use(@Err() error: any,
        @Req() request: Express.Request,
        @Res() response: Express.Response): any {

        if (error instanceof Exception || error instanceof Error || error.status) {
            request.log.error({
                error: {
                    message: error.message,
                    stack: error.stack,
                    status: error.status || 500
                }
            });
            response.status(error.status || 500).json({
                error: {
                    message: error.message,
                    stack: error.stack
                }
            });
            return;
        }

        if (typeof error === 'string') {
            response.status(500).json({
                message: error
            });
            return;
        }

        request.log.error({
            error: {
                status: 500,
                message: error.message,
                stack: error.stack
            }
        });
        response.status(error.status || 500).send('Internal Error');

        return;
    }
}
