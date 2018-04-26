import {EntityRepository, Repository} from 'typeorm';
import {EventVersionEntity} from './event-version.entity';

@EntityRepository(EventVersionEntity)
export class EventVersionRepository extends Repository<EventVersionEntity> {

}