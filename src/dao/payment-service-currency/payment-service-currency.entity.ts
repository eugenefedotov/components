import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';
import {CurrencyEntity} from '../currency/currency.entity';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';
import {Type} from 'serializer.ts/Decorators';
import {calculateFee} from '../../functions/calculate.fee';
import {BigNumber} from 'bignumber.js';

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

    @Column({
        type: 'double',
        nullable: true,
        comment: 'Шаг в инпуте'
    })
    step: number;

    @Type(type => PaymentServiceRequisiteTypeEntity)
    @ManyToMany(type => PaymentServiceRequisiteTypeEntity)
    @JoinTable({name: `payment_service_currency__requisite_types`})
    requisiteTypes: PaymentServiceRequisiteTypeEntity[];

    calculateFee(sum: number, byTarget: boolean): number {
        let fee = new BigNumber(0);

        if (this.feeFixed) {
            fee = fee.plus(this.feeFixed);
        }

        if (this.feePercent) {
            fee = fee.plus(calculateFee(sum, this.feePercent, byTarget));
        }

        return fee.toNumber();
    }

    /**
     * расчет необходимой суммы с учетом комиссии, чтобы получить итоговую
     */
    calculateSourceSum(targetSum: number): number {
        return Math.max(new BigNumber(targetSum).plus(this.calculateFee(targetSum, true)).toNumber(), 0);
    }

    /**
     * расчет итоговой суммы после вычета комиссии платежной системы
     */
    calculateTargetSum(sourceSum: number): number {
        return Math.max(new BigNumber(sourceSum).minus(this.calculateFee(sourceSum, false)).toNumber(), 0);
    }
}
