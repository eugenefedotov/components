import {EntityRepository, Repository} from 'typeorm';
import {UserGroupEntity} from './user-group.entity';

@EntityRepository(UserGroupEntity)
export class UserGroupRepository extends Repository<UserGroupEntity> {

}