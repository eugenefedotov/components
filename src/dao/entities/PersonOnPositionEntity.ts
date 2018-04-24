import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonOnPositionVersionEntity} from './PersonOnPositionVersionEntity';

@Entity('person_on_position')
export class PersonOnPositionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => PersonOnPositionVersionEntity)
    @JoinColumn()
    currentVersion: PersonOnPositionVersionEntity;

    @OneToMany(type => PersonOnPositionVersionEntity, object => object.personOnPosition)
    history: PersonOnPositionVersionEntity[];
}