import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {MaskEntity} from './mask.entity';

@Entity('mask_char')
export class MaskCharEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => MaskEntity)
    mask: MaskEntity;

    @Column({default: null, comment: 'Символы, которые можно использовать'})
    chars: string;

    @Column({default: '_'})
    placeholder: string;
}
