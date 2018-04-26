import {EntityRepository, Repository} from 'typeorm';
import {UserPermissionEntity} from './user-permission.entity';

@EntityRepository(UserPermissionEntity)
export class UserPermissionRepository extends Repository<UserPermissionEntity> {

}