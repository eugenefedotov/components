import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {EventEntity} from './event.entity';
import {ProofEntity} from '../proof/proof.entity';
import {VoteEntity} from "../vote/vote.entity";

@Entity('event_version')
export class EventVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => EventEntity)
    event: EventEntity;

    @Column('date', {nullable: true})
    dateBegin: Date;

    @Column('date', {nullable: true})
    dateEnd: Date;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];
}