import {Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {SubmissionEntity} from './SubmissionEntity';
import {ProofEntity} from '../proof/ProofEntity';
import {EventEntity} from '../event/EventEntity';
import {OrganizationEntity} from '../organization/OrganizationEntity';

@Entity('submission_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class SubmissionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => SubmissionEntity)
    submission: SubmissionEntity;

    @Column('date', {nullable: true})
    dateBegin: Date;

    @Column('date', {nullable: true})
    dateEnd: Date;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToOne(type => OrganizationEntity)
    superior: OrganizationEntity;

    @ManyToOne(type => OrganizationEntity)
    subordinate: OrganizationEntity;

    @ManyToMany(type => EventEntity)
    @JoinTable()
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];
}