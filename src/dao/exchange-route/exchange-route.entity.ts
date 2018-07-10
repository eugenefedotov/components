import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceCurrencyEntity} from '../payment-service-currency/payment-service-currency.entity';

@Entity('exchange_route')
export class ExchangeRouteEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PaymentServiceCurrencyEntity, {nullable: false, eager: true})
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Column({unsigned: true, type: 'double', nullable: true})
    fromMinAmount: number;

    @Column({unsigned: true, type: 'double', nullable: true})
    fromMaxAmount: number;

    @Column({unsigned: true, type: 'double', nullable: false})
    fromAmount: number;

    @ManyToOne(type => PaymentServiceCurrencyEntity, {nullable: false, eager: true})
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Column({unsigned: true, type: 'double', nullable: true})
    toMinAmount: number;

    @Column({unsigned: true, type: 'double', nullable: true})
    toMaxAmount: number;

    @Column({unsigned: true, type: 'double', nullable: false})
    toAmount: number;
}
