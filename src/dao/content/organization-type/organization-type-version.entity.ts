import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationTypeEntity} from './organization-type.entity';
import {VoteEntity} from '../vote/vote.entity';
import {ProofEntity} from '../proof/proof.entity';
import {UserEntity} from "../../core/auth/user/user.entity";
import {AuthorityScopeEntity} from "../authority-scope/authority-scope.entity";

@Entity('organization_type_version')
export class OrganizationTypeVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    insertUser: UserEntity;

    @ManyToOne(type => OrganizationTypeEntity, {eager: true})
    organizationType: OrganizationTypeEntity;

    @Column('date', {nullable: true})
    beginDate: Date;

    @Column('date', {nullable: true})
    endDate: Date;

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