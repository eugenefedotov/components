import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './person.entity';
import {ProofEntity} from '../proof/proof.entity';
import {VoteEntity} from "../vote/vote.entity";

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

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];
}