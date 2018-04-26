import {Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationEntity} from './OrganizationEntity';
import {ProofEntity} from '../proof/ProofEntity';
import {EventEntity} from '../event/EventEntity';
import {VoteEntity} from "../vote/VoteEntity";

@Entity('authority_of_state_power_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class OrganizationVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => OrganizationEntity)
    organization: OrganizationEntity;

    @Column('date', {nullable: true})
    dateBegin: Date;

    @Column('date', {nullable: true})
    dateEnd: Date;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    @JoinTable()
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];
}