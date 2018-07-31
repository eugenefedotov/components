import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';
import {CurrencyEntity} from '../currency/currency.entity';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('payment_service_currency')
export class PaymentServiceCurrencyEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Type(type => PaymentServiceEntity)
    @ManyToOne(type => PaymentServiceEntity, {eager: true})
    paymentService: PaymentServiceEntity;

    @Type(type => CurrencyEntity)
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

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToMany(type => PaymentServiceRequisiteTypeEntity)
    @JoinTable({name: `payment_service_currency__requisite_types`})
    requisiteTypes: PaymentServiceRequisiteTypeEntity[];
}
