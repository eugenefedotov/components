import {EntityRepository, Repository} from 'typeorm';
import {PersonOnPositionVersionEntity} from './person-on-position-version.entity';

@EntityRepository(PersonOnPositionVersionEntity)
export class PersonOnPositionVersionRepository extends Repository<PersonOnPositionVersionEntity> {

}