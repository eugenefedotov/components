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
import {UserEntity} from "../../core/auth/user/user.entity";
import {AuthorityScopeEntity} from "../authority-scope/authority-scope.entity";

@Entity('organization_version')
@Index('date_interval', ['beginDate', 'endDate'])
export class OrganizationVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    insertUser: UserEntity;

    @ManyToOne(type => OrganizationEntity, {eager: true})
    organization: OrganizationEntity;

    @ManyToOne(type => OrganizationTypeEntity, {eager: true})
    organizationType: OrganizationTypeEntity;

    @Column('date', {nullable: true})
    beginDate: Date;

    @Column('date', {nullable: true})
    endDate: Date;

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