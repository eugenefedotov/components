import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity('user_contact')
export class UserContactEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    user: UserEntity;

    @Column({type: 'enum', enum: ['phone', 'email']})
    type: 'phone' | 'email';

    @Column()
    value: string;

    @Column({nullable: false, default: false})
    confirmed: boolean;

    @Column({unsigned: true})
    confirmationCode: number;

    @Column('timestamp')
    confirmationCodeExpiredDate: Date;

    @Column({unsigned: true})
    confirmationCodeAttemptLeft: number;
}