import {Entity, ManyToOne} from 'typeorm';
import {Type} from 'serializer.ts/Decorators';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';
import {ExchangeEntity} from '../exchange/exchange.entity';
import {PaymentEntity} from '../payment/payment.entity';

@Entity('exchange_incoming_payment')
export class ExchangeIncomingPaymentEntity extends PaymentEntity {
    @ManyToOne(type => ExchangeEntity)
    exchange: ExchangeEntity;

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToOne(type => PaymentServiceRequisiteTypeEntity)
    fromRequisiteType: PaymentServiceRequisiteTypeEntity;

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToOne(type => PaymentServiceRequisiteTypeEntity)
    fromRequisiteValue: PaymentServiceRequisiteTypeEntity;
}
