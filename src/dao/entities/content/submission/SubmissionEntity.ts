import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {SubmissionVersionEntity} from "./SubmissionVersionEntity";

@Entity('submission')
export class SubmissionEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => SubmissionVersionEntity)
    @JoinColumn()
    currentVersion: SubmissionVersionEntity;

    @OneToMany(type => SubmissionVersionEntity, object => object.submission)
    history: SubmissionVersionEntity[];
}