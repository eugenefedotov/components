import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';
import {CurrencyEntity} from '../currency/currency.entity';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';

@Entity('payment_service_currency')
export class PaymentServiceCurrencyEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PaymentServiceEntity, {eager: true})
    paymentService: PaymentServiceEntity;

    @ManyToOne(type => CurrencyEntity, {eager: true})
    currency: CurrencyEntity;

    @Column({
        type: 'double',
        nullable: true,
        comment: 'Комиссия'
    })
    feeFixed: number;

    @Column({
        type: 'double',
        nullable: true,
        comment: 'Комиссия (%)'
    })
    feePercent: number;

    @Column({
        type: 'double',
        nullable: true,
        comment: 'Минимальная сумма транзакции'
    })
    minAmount: number;

    @Column({
        type: 'double',
        nullable: true,
        comment: 'Максимальная сумма транзакции'
    })
    maxAmount: number;

    @Column({
        unique: true
    })
    code: string;

    @ManyToMany(type => PaymentServiceRequisiteTypeEntity)
    @JoinTable({name: `payment_service_currency__requisite_types`})
    requisiteTypes: PaymentServiceRequisiteTypeEntity[];
}
