import {Service} from "typedi";
import {UserSessionEntity} from "../../../dao/core/auth/user-session/user-session.entity";
import {UserEntity} from "../../../dao/core/auth/user/user.entity";
import {OrmRepository} from "typeorm-typedi-extensions";
import {UserSessionRepository} from "../../../dao/core/auth/user-session/user-session.repository";
import {UserSessionConnectEntity} from "../../../dao/core/auth/user-session-connect/user-session-connect.entity";
import {UserSessionConnectRepository} from "../../../dao/core/auth/user-session-connect/user-session-connect.repository";

@Service()
export class SessionService {

    constructor(
        @OrmRepository() private userSessionRepository: UserSessionRepository,
        @OrmRepository() private userSessionConnectionRepository: UserSessionConnectRepository
    ) {
    }

    async useSession(sessionId: string, connectInfo: UserSessionConnectEntity): Promise<UserSessionEntity> {
        const session = await this.userSessionRepository.findOne(sessionId, {relations: ['connections']});

        if (!session) {
            throw new Error(`session not found`);
        }

        let connection = session.connections.find(con => con.ipV4Long === connectInfo.ipV4Long && con.userAgent === connectInfo.userAgent) || connectInfo;
        connection.dateLast = new Date();
        connection.session = session;

        await this.userSessionConnectionRepository.save(connection);

        session.dateLastUsage = new Date();
        delete session.connections;

        return this.userSessionRepository.save(session);
    }

    async openSession(user: UserEntity, connectInfo: UserSessionConnectEntity): Promise<UserSessionEntity> {
        const session = await this.userSessionRepository.create({
            connections: [connectInfo],
            insertUser: user,
            dateLastUsage: new Date()
        });

        return this.userSessionRepository.save(session);
    }

}