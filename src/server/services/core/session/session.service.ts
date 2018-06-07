import {UserEntity} from '../../../../dao/core/auth/user/user.entity';
import {SessionConnectModel} from './models/session-connect.model';
import {Service} from '@tsed/common';
import {Session} from './models/session';
import * as uuidv4 from 'uuid/v4';
import {SessionNotFoundException} from './exceptions/session-not-found.exception';
import {first} from 'rxjs/operators';

@Service()
export class SessionService {
    private sessions = new Map<string, Session>();

    async openSession(user: UserEntity, sessionConnect: SessionConnectModel): Promise<Session> {
        const sessionId = uuidv4();
        const session = new Session(sessionId, user.id);

        session.destroy$.pipe(first()).subscribe(() => this.destroySession(sessionId));

        this.sessions.set(sessionId, session);
        return this.useSession(sessionId, sessionConnect);
    }

    async useSession(sessionId: string, sessionConnect: SessionConnectModel): Promise<Session> {
        const session = this.getSession(sessionId);

        return session;
    }

    async getSession(sessionId: string): Promise<Session> {
        if (!this.sessions.has(sessionId)) {
            throw new SessionNotFoundException();
        }
        return this.sessions.get(sessionId);
    }

    async destroySession(sessionId: string) {
        const session = await this.getSession(sessionId); // check
        session.destroy();
        this.sessions.delete(sessionId);
    }
}