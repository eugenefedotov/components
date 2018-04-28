import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from '../user/user.entity';
import {UserSessionConnectEntity} from "../user-session-connect/user-session-connect.entity";

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

    @OneToMany(type => UserSessionConnectEntity, object => object.session)
    connections: UserSessionConnectEntity[];
}