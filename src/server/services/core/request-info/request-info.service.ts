import {Service} from '@tsed/common';
import {SessionConnectModel} from '../session/models/session-connect.model';
import * as Express from 'express';
import {ip2long} from '../../../../functions/ip2long';

@Service()
export class RequestInfoService {

    getConnectInfo(request: Express.Request): SessionConnectModel {
        return {
            ipV4Long: ip2long(request.ip),
            userAgent: request.header('user-agent')
        };
    }
}