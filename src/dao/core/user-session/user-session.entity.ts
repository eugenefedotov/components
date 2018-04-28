import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from '../user/user.entity';

@Entity('user_session')
export class UserSessionEntity {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    user: UserEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @Column('timestamp', {nullable: true})
    dateExpire: Date;

    @Column('timestamp', {nullable: true})
    dateLastUsage: Date;

    @Column('simple-array')
    ips: string[];
}