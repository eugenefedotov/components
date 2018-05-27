import {UserSessionEntity} from '../../../../dao/core/auth/user-session/user-session.entity';
import {UserEntity} from '../../../../dao/core/auth/user/user.entity';
import {UserSessionRepository} from '../../../../dao/core/auth/user-session/user-session.repository';
import {UserSessionConnectRepository} from '../../../../dao/core/auth/user-session-connect/user-session-connect.repository';
import {SessionConnectModel} from './models/session-connect.model';
import {UserSessionConnectEntity} from '../../../../dao/core/auth/user-session-connect/user-session-connect.entity';
import {SessionNotFoundException} from './exceptions/session-not-found.exception';
import {Service} from '@tsed/common';
import {getCustomRepository} from 'typeorm';

@Service()
export class SessionService {
    private userSessionRepository = getCustomRepository(UserSessionRepository);
    private userSessionConnectionRepository = getCustomRepository(UserSessionConnectRepository);

    async useSession(sessionId: string, sessionConnect: SessionConnectModel): Promise<UserSessionEntity> {
        const session = await this.userSessionRepository.findOne(sessionId, {relations: ['connections']});

        if (!session) {
            throw new SessionNotFoundException();
        }

        let connection: UserSessionConnectEntity = session.connections.find(con => con.ipV4Long === sessionConnect.ipV4Long && con.userAgent === sessionConnect.userAgent);

        if (!connection) {
            connection = this.userSessionConnectionRepository.create(sessionConnect);
        }

        connection.lastDate = new Date();
        connection.session = session;

        await this.userSessionConnectionRepository.save(connection);

        session.lastUsageDate = new Date();
        delete session.connections;

        return this.userSessionRepository.save(session);
    }

    async openSession(user: UserEntity, sessionConnect: SessionConnectModel): Promise<UserSessionEntity> {
        const connection = this.userSessionConnectionRepository.create(sessionConnect);

        const session = this.userSessionRepository.create({
            connections: [connection],
            user: user,
            lastUsageDate: new Date()
        });

        return this.userSessionRepository.save(session);
    }

}