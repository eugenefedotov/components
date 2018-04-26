import {Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonOnPositionEntity} from './PersonOnPositionEntity';
import {PersonEntity} from '../person/PersonEntity';
import {PositionEntity} from '../position/PositionEntity';
import {EventEntity} from '../event/EventEntity';
import {ProofEntity} from '../proof/ProofEntity';
import {VoteEntity} from "../vote/VoteEntity";

@Entity('person_on_position_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class PersonOnPositionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PersonOnPositionEntity)
    personOnPosition: PersonOnPositionEntity;

    @ManyToOne(type => PersonEntity)
    person: PersonEntity;

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

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];
}