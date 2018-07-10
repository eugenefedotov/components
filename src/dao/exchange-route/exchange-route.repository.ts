import {EntityRepository, Repository} from 'typeorm';
import {ExchangeRouteEntity} from './exchange-route.entity';

@EntityRepository(ExchangeRouteEntity)
export class ExchangeRouteRepository extends Repository<ExchangeRouteEntity> {

}