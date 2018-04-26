import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../core/UserEntity";

@Entity('vote')
export class VoteEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @Column()
    accepted: boolean;
}