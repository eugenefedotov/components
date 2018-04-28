import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {OrganizationEntity} from './organization.entity';
import {ProofEntity} from '../proof/proof.entity';
import {EventEntity} from '../event/event.entity';
import {VoteEntity} from "../vote/vote.entity";
import {OrganizationTypeEntity} from '../organization-type/organization-type.entity';
import {UserEntity} from "../../core/user/user.entity";

@Entity('authority_of_state_power_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class OrganizationVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(type => OrganizationEntity, {eager: true})
    organization: OrganizationEntity;

    @ManyToOne(type => OrganizationTypeEntity, {eager: true})
    organizationType: OrganizationTypeEntity;

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