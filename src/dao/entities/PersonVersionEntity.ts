import {Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './PersonEntity';

@Entity('person_version')
export class PersonVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PersonEntity)
    person: PersonEntity;
}