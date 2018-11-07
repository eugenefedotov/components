import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ValidatorPatternItemTypeEnum} from './validator-pattern-item-type.enum';
import {escapeRegExp} from '../../functions/escape-reg-exp';
import {ValidatorEntity} from './validator.entity';

@Entity('validator_pattern_item')
export class ValidatorPatternItemEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => ValidatorEntity)
    validator: ValidatorEntity;

    @Column({type: 'enum', enum: ValidatorPatternItemTypeEnum})
    type: ValidatorPatternItemTypeEnum;


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
            case ValidatorPatternItemTypeEnum.FixedString:
                return this.fixedString;
            case ValidatorPatternItemTypeEnum.RegExpPattern:
                return this.regExpPlaceholder;
        }
    }

    getRegExp(start: boolean): RegExp {
        const startPattern = start ? '^' : '';
        switch (this.type) {
            case ValidatorPatternItemTypeEnum.FixedString:
                return new RegExp(startPattern + escapeRegExp(this.fixedString));
            case ValidatorPatternItemTypeEnum.RegExpPattern:
                return new RegExp(startPattern + this.regExpPattern, this.regExpPattern);
        }
    }

    getLengths(): [number, number] {
        switch (this.type) {
            case ValidatorPatternItemTypeEnum.FixedString:
                return [String(this.fixedString).length, String(this.fixedString).length];
            case ValidatorPatternItemTypeEnum.RegExpPattern:
                return [this.regExpMinLength, this.regExpMaxLength];
        }
    }
}
