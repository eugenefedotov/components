import {
    AuthenticatedMiddleware,
    EndpointInfo,
    EndpointMetadata,
    IMiddleware,
    Next,
    OverrideMiddleware,
    Request,
    Response
} from '@tsed/common';
import * as Express from 'express';
import {SessionService} from '../../services/core/session/session.service';
import {AuthenticationInfoModel} from '../../models/authentication-info.model';
import {Forbidden} from '../../../../node_modules/@tsed/common/src/node_modules/ts-httpexceptions/lib/clientErrors';
import {RequestInfoService} from '../../services/core/request-info/request-info.service';

const SESSION_HEADER_KEY = 'X-Session';

@OverrideMiddleware(AuthenticatedMiddleware)
export class MyAuthenticationMiddleware implements IMiddleware {

    constructor(private sessionService: SessionService,
                private requestInfoService: RequestInfoService) {

    }

    public async use(@EndpointInfo() endpoint: EndpointMetadata,
                     @Request() request: Express.Request,
                     @Response() response: Express.Response,
                     @Next() next: Express.NextFunction) { // next is optional

        const requestInfo = this.requestInfoService.getConnectInfo(request);
        const authInfo = request['authInfo'] = {} as AuthenticationInfoModel;

        // options given to the @Authenticated decorator
        const options = endpoint.get(AuthenticatedMiddleware) || {};
        // options => {role: 'admin'}

        authInfo.sessionId = request.header(SESSION_HEADER_KEY);

        if (authInfo.sessionId) {
            try {
                await this.sessionService.useSession(authInfo.sessionId, requestInfo);
            } catch (e) {
                authInfo.sessionId = null;
            }
        }

        if (!options.allowGuest && !authInfo.sessionId) {
            throw new Forbidden('authentication required');
        }

        if (authInfo.sessionId) {
            response.header(SESSION_HEADER_KEY, authInfo.sessionId);
        }

        next();
    }
}