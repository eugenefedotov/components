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
import {SubmissionEntity} from './submission.entity';
import {ProofEntity} from '../proof/proof.entity';
import {EventEntity} from '../event/event.entity';
import {OrganizationEntity} from '../organization/organization.entity';
import {VoteEntity} from "../vote/vote.entity";
import {UserEntity} from "../../core/auth/user/user.entity";
import {AuthorityScopeEntity} from "../authority-scope/authority-scope.entity";

@Entity('submission_version')
@Index('date_interval', ['beginDate', 'endDate'])
export class SubmissionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    insertUser: UserEntity;

    @ManyToOne(type => SubmissionEntity, {eager: true})
    submission: SubmissionEntity;

    @Column('date', {nullable: true})
    beginDate: Date;

    @Column('date', {nullable: true})
    endDate: Date;

    @ManyToOne(type => OrganizationEntity, {eager: true})
    superior: OrganizationEntity;

    @ManyToOne(type => OrganizationEntity, {eager: true})
    subordinate: OrganizationEntity;

    @ManyToMany(type => EventEntity)
    @JoinTable()
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];

    @ManyToMany(type => AuthorityScopeEntity)
    @JoinTable()
    scopes: AuthorityScopeEntity[];
}