import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PersonEntity} from './person.entity';
import {ProofEntity} from '../proof/proof.entity';
import {VoteEntity} from "../vote/vote.entity";
import {UserEntity} from "../../core/auth/user/user.entity";
import {AuthorityScopeEntity} from "../authority-scope/authority-scope.entity";

@Entity('person_version')
export class PersonVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    insertUser: UserEntity;

    @ManyToOne(type => PersonEntity, {eager: true})
    person: PersonEntity;

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

    @ManyToMany(type => AuthorityScopeEntity)
    @JoinTable()
    scopes: AuthorityScopeEntity[];
}