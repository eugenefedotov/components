import {EntityRepository, Repository} from 'typeorm';
import {EventEntity} from './event.entity';

@EntityRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {

}