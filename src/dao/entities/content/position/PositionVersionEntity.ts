import {Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PositionEntity} from './PositionEntity';
import {ProofEntity} from "../proof/ProofEntity";
import {EventEntity} from "../event/EventEntity";

@Entity('position_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class PositionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PositionEntity)
    position: PositionEntity;

    @Column('date', {nullable: true})
    dateBegin: Date;

    @Column('date', {nullable: true})
    dateEnd: Date;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    @JoinTable()
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];
}