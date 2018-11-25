import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {MaskCharEntity} from './mask-char.entity';
import {Type} from 'serializer.ts/Decorators';

export interface MaskResult {
    text: string;
    adding: boolean;
    formatted: string;
    cursor: number;
}

@Entity('mask')
export class MaskEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @Type(type => MaskCharEntity)
    @OneToMany(type => MaskCharEntity, object => object.mask, {
        eager: true,
        cascade: true
    })
    chars: MaskCharEntity[];

    isStartWith(value: string): boolean {
        for (const patternItem of this.chars) {
            if (!value.length) {
                return true;
            }

            if (!patternItem.chars.includes(value[0])) {
                return false;
            }

            value = value.slice(1);
        }

        return false;
    }

    isValidAndComplete(value: string): boolean {
        for (const patternItem of this.chars) {
            if (!patternItem.chars.includes(value[0])) {
                return false;
            }

            value = value.slice(1);
        }

        return !value.length;
    }

    try(text: string, adding = true): MaskResult {
        let remainingText = text;
        let cursor: number = null;
        let formatted = '';
        for (let i = 0; i < this.chars.length; i++) {
            const patternItem = this.chars[i];
            const staticChar = patternItem.chars.length === 1 ? patternItem.chars[0] : null;
            const currentChar = remainingText.length ? remainingText[0] : null;
            const isMatched = patternItem.chars.includes(currentChar);

            if (staticChar !== null) {
                formatted += staticChar;
            } else if (isMatched) {
                formatted += currentChar;
            } else {
                formatted += patternItem.placeholder;
            }

            if (isMatched) {
                remainingText = remainingText.slice(1);
            }

            if (cursor === null && !isMatched && (staticChar === null || !adding)) {
                cursor = formatted.length - 1;
            }
        }

        return {
            text,
            adding,
            formatted,
            cursor
        };
    }
}
