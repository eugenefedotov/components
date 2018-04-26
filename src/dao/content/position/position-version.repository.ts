import {EntityRepository, Repository} from 'typeorm';
import {PersonVersionEntity} from '../person/person-version.entity';

@EntityRepository(PersonVersionEntity)
export class PositionVersionRepository extends Repository<PersonVersionEntity> {

}