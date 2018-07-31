import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceCurrencyEntity} from '../payment-service-currency/payment-service-currency.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('exchange_route')
@Index('route', ['fromPaymentServiceCurrency', 'toPaymentServiceCurrency'], {unique: true})
export class ExchangeRouteEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({default: false})
    isEnabled: boolean;

    @Type(type => PaymentServiceCurrencyEntity)
    @ManyToOne(type => PaymentServiceCurrencyEntity, {nullable: false, eager: true})
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Column({unsigned: true, type: 'double', nullable: true})
    fromMinAmount: number;

    @Column({unsigned: true, type: 'double', nullable: true})
    fromMaxAmount: number;

    @Column({unsigned: true, type: 'double', nullable: false})
    fromAmount: number;

    @Type(type => PaymentServiceCurrencyEntity)
    @ManyToOne(type => PaymentServiceCurrencyEntity, {nullable: false, eager: true})
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Column({unsigned: true, type: 'double', nullable: true})
    toMinAmount: number;

    @Column({unsigned: true, type: 'double', nullable: true})
    toMaxAmount: number;

    @Column({unsigned: true, type: 'double', nullable: false})
    toAmount: number;
}
