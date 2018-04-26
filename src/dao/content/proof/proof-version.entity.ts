import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProofEntity} from './proof.entity';
import {EventEntity} from '../event/event.entity';
import {VoteEntity} from "../vote/vote.entity";

@Entity('proof_version')
export class ProofVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => ProofEntity)
    proof: ProofEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    @JoinTable()
    events: EventEntity[];

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];
}