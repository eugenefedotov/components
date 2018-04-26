import {EntityRepository, Repository} from 'typeorm';
import {PersonOnPositionEntity} from './person-on-position.entity';

@EntityRepository(PersonOnPositionEntity)
export class PersonOnPositionRepository extends Repository<PersonOnPositionEntity> {

}