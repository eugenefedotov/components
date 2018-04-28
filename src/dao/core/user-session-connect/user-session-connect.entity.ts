import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserSessionEntity} from "../user-session/user-session.entity";

@Entity('user_session_connect')
export class UserSessionConnectEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserSessionEntity, {eager: true})
    @JoinColumn()
    session: UserSessionEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @Column('timestamp')
    dateLast: Date;

    @Column()
    ipV4Long: number;

    @Column()
    userAgent: string;
}