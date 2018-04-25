import {Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PositionEntity} from './PositionEntity';
import {ProofEntity} from "./ProofEntity";
import {EventEntity} from "./EventEntity";

@Entity('position_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class PositionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PositionEntity)
    position: PositionEntity;

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;

    @Column('datetime')
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    proofs: ProofEntity[];
}