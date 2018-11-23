import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {MaskCharEntity} from './mask-char.entity';

@Entity('mask')
export class MaskEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @OneToMany(type => MaskCharEntity, object => object.mask, {
        eager: true,
        cascade: true
    })
    chars: MaskCharEntity[];

    format(value: string): string {
        let formatted = '';
        let valid = true;
        for (const patternItem of this.chars) {
            if (value.length && valid && patternItem.isStartWith(value)) {
                formatted = formatted + patternItem.getMatchedPart(value);
                value = patternItem.deleteStartFrom(value);
                continue;
            } else {
                valid = false;
            }

            if (!valid) {
                formatted = formatted + patternItem.placeholder;
                continue;
            }
        }

        return formatted;
    }

    isStartWith(value: string): boolean {
        for (const patternItem of this.chars) {
            if (!value.length) {
                return true;
            }

            if (!patternItem.isStartWith(value)) {
                return false;
            }

            value = patternItem.deleteStartFrom(value);
        }

        return false;
    }

    isValidAndComplete(value: string): boolean {
        for (const patternItem of this.chars) {
            if (!patternItem.isStartWith(value)) {
                return false;
            }

            value = patternItem.deleteStartFrom(value);
        }

        return !value.length;
    }
}
