import {Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SubmissionEntity} from "./SubmissionEntity";
import {ProofEntity} from "./ProofEntity";
import {EventEntity} from "./EventEntity";

@Entity('submission_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class SubmissionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => SubmissionEntity)
    submission: SubmissionEntity;

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;

    @Column('datetime')
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    proofs: ProofEntity[];
}