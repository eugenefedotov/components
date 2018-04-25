import {Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonOnPositionEntity} from './PersonOnPositionEntity';
import {PersonEntity} from './PersonEntity';
import {PositionEntity} from './PositionEntity';
import {EventEntity} from "./EventEntity";
import {ProofEntity} from "./ProofEntity";

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