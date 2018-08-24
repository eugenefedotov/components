import {Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ExchangeRouteEntity} from '../exchange-route/exchange-route.entity';

@Entity('exchange')
export class ExchangeEntity {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(type => ExchangeRouteEntity)
    exchangeRoute: ExchangeRouteEntity;

}
