import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity('user_contact')
export class UserContactEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    insertUser: UserEntity;

    @Column({type: 'enum', enum: ['phone', 'email']})
    type: 'phone' | 'email';

    @Column()
    value: string;

    @Column({type: 'boolean', nullable: false, default: false})
    confirmed: boolean;

    @Column()
    confirmationCode: number;

    @Column('timestamp')
    confirmationCodeExpired: Date;

    @Column()
    confirmationCodeAttemptLeft: number;
}