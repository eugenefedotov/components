import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProofEntity} from './proof.entity';
import {EventEntity} from '../event/event.entity';
import {VoteEntity} from "../vote/vote.entity";
import {UserEntity} from "../../core/auth/user/user.entity";

@Entity('proof_version')
export class ProofVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(type => ProofEntity, {eager: true})
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