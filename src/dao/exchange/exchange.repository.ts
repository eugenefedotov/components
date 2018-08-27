import {EntityRepository, Repository} from 'typeorm';
import {ExchangeEntity} from './exchange.entity';

@EntityRepository(ExchangeEntity)
export class ExchangeRepository extends Repository<ExchangeEntity> {

}
