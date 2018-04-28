import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserGroupEntity} from '../user-group/user-group.entity';
import {UserContactEntity} from "../user-contact/user-contact.entity";

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({unique: true, nullable: false})
    login: string;

    @ManyToMany(type => UserGroupEntity)
    @JoinTable()
    groups: UserGroupEntity[];

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @OneToMany(type => UserContactEntity, object => object.user)
    contacts: UserContactEntity[];
}