import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ValidatorEntity} from './validator.entity';
import {escapeRegExp} from '../../functions/escape-reg-exp';

@Entity('validator_pattern_item')
export class ValidatorCharEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => ValidatorEntity)
    validator: ValidatorEntity;

    @Column({default: null, comment: 'Символы, которые можно использовать'})
    chars: string;

    @Column({default: '_'})
    placeholder: string;

    @Column({default: 1, unsigned: true, comment: 'Минимальное кол-во символов'})
    minLength: number;

    @Column({default: 1, unsigned: true, comment: 'Максимальное кол-во символов'})
    maxLength: number;

    isStartWith(value: string): boolean {
        return this.getRegExp().test(value);
    }

    getMatchedPart(value: string): string {
        return this.getRegExp().exec(value)[0];
    }

    deleteStartFrom(value: string): string {
        return value.replace(this.getRegExp(), '');
    }

    private getRegExp(): RegExp {
        return new RegExp(`^[${escapeRegExp(this.chars)}]{${this.minLength},${this.maxLength}}`);
    }
}
