import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ExchangeRouteEntity} from '../exchange-route/exchange-route.entity';
import {Type} from 'serializer.ts/Decorators';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';

@Entity('exchange')
export class ExchangeEntity {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Type(type => ExchangeRouteEntity)
    @ManyToOne(type => ExchangeRouteEntity, {nullable: false, eager: true})
    exchangeRoute: ExchangeRouteEntity;

    @Column({unsigned: true, type: 'double', nullable: true})
    fromSum: number;

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToOne(type => PaymentServiceRequisiteTypeEntity, {nullable: false, eager: true})
    toRequisiteType: PaymentServiceRequisiteTypeEntity;

    @Column()
    toRequisiteValue: string;
}
