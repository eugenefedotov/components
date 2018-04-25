import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SubmissionEntity} from "./SubmissionEntity";

@Entity('submission_version')
export class SubmissionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => SubmissionEntity)
    submission: SubmissionEntity;

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;
}