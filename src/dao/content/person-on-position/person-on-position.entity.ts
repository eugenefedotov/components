import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonOnPositionVersionEntity} from './person-on-position-version.entity';

@Entity('person_on_position')
export class PersonOnPositionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => PersonOnPositionVersionEntity, {eager: true})
    @JoinColumn()
    currentVersion: PersonOnPositionVersionEntity;

    @OneToMany(type => PersonOnPositionVersionEntity, object => object.personOnPosition)
    history: PersonOnPositionVersionEntity[];
}