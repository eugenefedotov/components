import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserGroupEntity} from '../user-group/user-group.entity';
import {UserContactEntity} from '../user-contact/user-contact.entity';
import {AuthorityEntity} from '../../../content/authority/authority.entity';
import {IgnoreProperty} from '@tsed/common';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @Column({unique: true, nullable: false})
    login: string;

    @Column()
    @IgnoreProperty()
    passwordHash: string;

    @ManyToMany(type => UserGroupEntity)
    @JoinTable()
    groups: UserGroupEntity[];

    @OneToMany(type => AuthorityEntity, object => object.user)
    authorities: AuthorityEntity[];

    @OneToMany(type => UserContactEntity, object => object.user)
    contacts: UserContactEntity[];
}