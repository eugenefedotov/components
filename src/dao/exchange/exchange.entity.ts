import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ExchangeRouteEntity} from '../exchange-route/exchange-route.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('exchange')
export class ExchangeEntity {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Type(type => ExchangeRouteEntity)
    @ManyToOne(type => ExchangeRouteEntity)
    exchangeRoute: ExchangeRouteEntity;

    @Column({unsigned: true, type: 'double', nullable: true})
    fromSum: number;
}
