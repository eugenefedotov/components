import {EntityRepository, Repository} from 'typeorm';
import {PermissionGroupEntity} from './permission-group.entity';

@EntityRepository(PermissionGroupEntity)
export class PermissionGroupRepository extends Repository<PermissionGroupEntity> {

}