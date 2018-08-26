import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceRequisiteTypeEntity} from './payment-service-requisite-type.entity';
import {PaymentServiceRequisiteTypePatternItemTypeEnum} from './payment-service-requisite-type-pattern-item-type.enum';
import {escapeRegExp} from '../../functions/escape-reg-exp';

@Entity('payment_service_requisite_type_item')
export class PaymentServiceRequisiteTypePatternItemEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PaymentServiceRequisiteTypeEntity)
    paymentServiceRequisiteType: PaymentServiceRequisiteTypeEntity;

    @Column({type: 'enum', enum: PaymentServiceRequisiteTypePatternItemTypeEnum})
    type: PaymentServiceRequisiteTypePatternItemTypeEnum;


    @Column({default: null})
    fixedString: string;

    @Column({default: '_'})
    regExpPlaceholder: string;

    @Column({default: null})
    regExpPattern: string;

    @Column({default: ''})
    regExpFlags: string;

    @Column({default: 1, unsigned: true, comment: 'Минимальное кол-во символов, которое может быть в регулярке'})
    regExpMinLength: number;

    @Column({default: 1, unsigned: true, comment: 'Максимальное кол-во символов, которое может быть в регулярке'})
    regExpMaxLength: number;

    getPlaceholder(): string {
        switch (this.type) {
            case PaymentServiceRequisiteTypePatternItemTypeEnum.FixedString:
                return this.fixedString;
            case PaymentServiceRequisiteTypePatternItemTypeEnum.RegExpPattern:
                return this.regExpPlaceholder;
        }
    }

    getRegExp(start: boolean): RegExp {
        const startPattern = start ? '^' : '';
        switch (this.type) {
            case PaymentServiceRequisiteTypePatternItemTypeEnum.FixedString:
                return new RegExp(startPattern + escapeRegExp(this.fixedString));
            case PaymentServiceRequisiteTypePatternItemTypeEnum.RegExpPattern:
                return new RegExp(startPattern + this.regExpPattern, this.regExpPattern);
        }
    }

    getLengths(): [number, number] {
        switch (this.type) {
            case PaymentServiceRequisiteTypePatternItemTypeEnum.FixedString:
                return [String(this.fixedString).length, String(this.fixedString).length];
            case PaymentServiceRequisiteTypePatternItemTypeEnum.RegExpPattern:
                return [this.regExpMinLength, this.regExpMaxLength];
        }
    }
}
