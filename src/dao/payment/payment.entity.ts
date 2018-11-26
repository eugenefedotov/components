import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ExchangeEntity} from '../exchange/exchange.entity';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('payment')
export class PaymentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ExchangeEntity)
    incoming: ExchangeEntity;

    @ManyToOne(type => ExchangeEntity)
    outgoing: ExchangeEntity;

    @Column({unsigned: true, type: 'double', nullable: false})
    sum: number;

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToOne(type => PaymentServiceRequisiteTypeEntity)
    requisiteType: PaymentServiceRequisiteTypeEntity;

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToOne(type => PaymentServiceRequisiteTypeEntity)
    requisiteValue: PaymentServiceRequisiteTypeEntity;
}
