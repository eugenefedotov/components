import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './person.entity';
import {ProofEntity} from '../proof/proof.entity';
import {VoteEntity} from "../vote/vote.entity";
import {UserEntity} from "../../core/user/user.entity";

@Entity('person_version')
export class PersonVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(type => PersonEntity, {eager: true})
    person: PersonEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];

    @Column({type: "enum", enum: ['male', 'female']})
    gender: 'male' | 'female';

    @Column({comment: 'Имя'})
    firstName: string;

    @Column({comment: 'Фамилия'})
    secondName: string;

    @Column({comment: 'Отчество'})
    patronymic: string;

    @Column('date', {nullable: true, comment: 'Дата рождения'})
    dateOfBirth: Date;

    @Column('date', {nullable: true, comment: 'Дата смерти'})
    dateOfDeath: Date;
}