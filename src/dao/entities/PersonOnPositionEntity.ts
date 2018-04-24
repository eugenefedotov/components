import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './PersonEntity';
import {PositionEntity} from './PositionEntity';

@Entity('person_on_position')
export class PersonOnPositionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PersonEntity)
    person: PersonEntity;

    @ManyToOne(type => PositionEntity)
    position: PositionEntity;

    @Column()
    dateBegin: Date;

    @Column()
    dateEnd: Date;
}