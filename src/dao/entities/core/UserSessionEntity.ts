import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity('user_session')
export class UserSessionEntity {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    dateSave: Date;
}