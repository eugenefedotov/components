import {EntityRepository, Repository} from 'typeorm';
import {UserSessionEntity} from './user-session.entity';

@EntityRepository(UserSessionEntity)
export class UserSessionRepository extends Repository<UserSessionEntity> {

}