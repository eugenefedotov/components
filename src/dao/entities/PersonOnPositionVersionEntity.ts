import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonOnPositionEntity} from './PersonOnPositionEntity';
import {PersonEntity} from './PersonEntity';
import {PositionEntity} from './PositionEntity';

@Entity('person_on_position_version')
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
}