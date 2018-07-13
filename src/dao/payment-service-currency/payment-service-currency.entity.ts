import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';
import {CurrencyEntity} from '../currency/currency.entity';
import {calculateFee} from '../../functions/calculateFee';

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

    correctSourceSum(sourceSum: number): number {
        if (this.minAmount) {
            sourceSum = Math.max(sourceSum, this.minAmount);
        }

        if (this.maxAmount) {
            sourceSum = Math.min(sourceSum, this.maxAmount);
        }

        return sourceSum;
    }

    /**
     * расчет необходимой суммы с учетом комиссии, чтобы получить итоговую
     */
    calculateSourceSum(targetSum: number): number {
        if (this.feeFixed) {
            targetSum += this.feeFixed;
        }

        if (this.feePercent) {
            targetSum += calculateFee(targetSum, this.feePercent, true);
        }

        return targetSum;
    }

    /**
     * расчет итоговой суммы после вычета комиссии платежной системы
     */
    calculateTargetSum(sourceSum: number): number {
        if (this.feePercent) {
            sourceSum -= calculateFee(sourceSum, this.feePercent);
        }

        if (this.feeFixed) {
            sourceSum -= this.feeFixed;
        }

        return sourceSum;
    }
}
