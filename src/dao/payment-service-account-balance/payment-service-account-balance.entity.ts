import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceAccountEntity} from '../payment-service-account/payment-service-account.entity';
import {CurrencyEntity} from '../currency/currency.entity';

@Entity('payment_service_account_balance')
export class PaymentServiceAccountBalanceEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PaymentServiceAccountEntity, {eager: true, nullable: false, onDelete: 'CASCADE'})
    account: PaymentServiceAccountEntity;

    @ManyToOne(type => CurrencyEntity, {eager: true, nullable: false, onDelete: 'CASCADE'})
    currency: CurrencyEntity;

    @Column({
        type: 'double',
        nullable: false,
        comment: 'Баланс'
    })
    amount: number;

    @Column({type: 'datetime'})
    date: Date = new Date();

}