import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonVersionEntity} from './person-version.entity';

@Entity('person')
export class PersonEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => PersonVersionEntity, {eager: true})
    @JoinColumn()
    currentVersion: PersonVersionEntity;

    @OneToMany(type => PersonVersionEntity, object => object.person)
    history: PersonVersionEntity[];
}