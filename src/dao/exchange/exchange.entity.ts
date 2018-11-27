import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ExchangeRouteEntity} from '../exchange-route/exchange-route.entity';
import {Type} from 'serializer.ts/Decorators';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';
import {ExchangeIncomingPaymentEntity} from '../exchange-incoming-payment/exchange-incoming-payment.entity';
import {ExchangeOutgoingPaymentEntity} from '../exchange-outgoing-payment/exchange-outgoing-payment.entity';

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

    @Type(type => ExchangeIncomingPaymentEntity)
    @OneToMany(type => ExchangeIncomingPaymentEntity, object => object.exchange, {eager: true})
    incomingPayments: ExchangeIncomingPaymentEntity[];

    @Type(type => ExchangeOutgoingPaymentEntity)
    @OneToMany(type => ExchangeOutgoingPaymentEntity, object => object.exchange, {eager: true})
    outgoingPayments: ExchangeOutgoingPaymentEntity[];
}
