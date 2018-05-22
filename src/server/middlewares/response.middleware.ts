import {ConverterService, OverrideMiddleware, Response, ResponseData, SendResponseMiddleware} from '@tsed/common';
import * as Express from 'express';
import {jsonIgnoreReplacer} from 'json-ignore';


@OverrideMiddleware(SendResponseMiddleware)
export class ResponseMiddleware extends SendResponseMiddleware {

    constructor(protected _converterService: ConverterService) {
        super(_converterService);
    }

    public use(@ResponseData() data: any, @Response() response: Express.Response) {
        if (response.headersSent) {
            return;
        }

        const type = typeof data;

        if (data === undefined) {
            response.send('');
        } else if (data === null || ['number', 'boolean', 'string'].indexOf(type) > -1) {
            response.send(String(data));
        } else {
            response.setHeader('Content-Type', 'text/json');
            const obj = JSON.parse(JSON.stringify(data, jsonIgnoreReplacer));
            response.json(this._converterService.serialize(obj));
        }
    }
}