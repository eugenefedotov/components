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
    insertDate: Date;

    @Column('timestamp', {nullable: true})
    expireDate: Date;

    @Column('timestamp', {nullable: true})
    lastUsageDate: Date;

    @OneToMany(type => UserSessionConnectEntity, object => object.session)
    connections: UserSessionConnectEntity[];
}