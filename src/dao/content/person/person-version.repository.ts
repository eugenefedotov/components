import {EntityRepository, Repository} from 'typeorm';
import {PersonVersionEntity} from './person-version.entity';

@EntityRepository(PersonVersionEntity)
export class PersonVersionRepository extends Repository<PersonVersionEntity> {

}