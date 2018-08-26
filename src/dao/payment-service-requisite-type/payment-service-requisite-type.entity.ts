import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceRequisiteTypePatternItemEntity} from './payment-service-requisite-type-pattern-item.entity';

@Entity('payment_service_requisite_type')
export class PaymentServiceRequisiteTypeEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @OneToMany(type => PaymentServiceRequisiteTypePatternItemEntity, object => object.paymentServiceRequisiteType, {
        eager: true,
        cascade: true
    })
    patternItems: PaymentServiceRequisiteTypePatternItemEntity[];

    format(value: string): string {
        let formatted = '';
        let valid = true;
        for (const patternItem of this.patternItems) {
            if (value.length && valid && patternItem.getRegExp(true).test(value)) {
                formatted = formatted + patternItem.getRegExp(true).exec(value)[0];
                value = value.replace(patternItem.getRegExp(true), '');
                continue;
            } else {
                valid = false;
            }

            if (!valid) {
                formatted = formatted + patternItem.getPlaceholder();
                continue;
            }
        }

        return formatted;
    }

    isStartWith(value: string): boolean {
        for (const patternItem of this.patternItems) {
            if (!value.length) {
                return true;
            }

            const regExp = patternItem.getRegExp(true);

            if (!regExp.test(value)) {
                return false;
            }

            value = value.replace(regExp, '');
        }

        return false;
    }

    isValidAndComplete(value: string): boolean {
        // todo
        return null;
    }
}
