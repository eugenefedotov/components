import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './PersonEntity';
import {ProofEntity} from './ProofEntity';

@Entity('person_version')
export class PersonVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PersonEntity)
    person: PersonEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];
}