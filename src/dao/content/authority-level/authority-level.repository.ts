import {EntityRepository, Repository} from 'typeorm';
import {AuthorityLevelEntity} from './authority-level.entity';

@EntityRepository(AuthorityLevelEntity)
export class AuthorityLevelRepository extends Repository<AuthorityLevelEntity> {

}