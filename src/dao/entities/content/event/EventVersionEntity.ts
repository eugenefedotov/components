import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {EventEntity} from './EventEntity';
import {ProofEntity} from '../proof/ProofEntity';
import {VoteEntity} from "../vote/VoteEntity";

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