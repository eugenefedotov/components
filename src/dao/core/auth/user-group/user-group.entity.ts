import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from '../user/user.entity';
import {UserPermissionEntity} from '../user-permission/user-permission.entity';

@Entity('user_group')
export class UserGroupEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => UserEntity, object => object.groups)
    users: UserEntity[];

    @ManyToMany(type => UserPermissionEntity, {eager: true})
    @JoinTable()
    permissions: UserPermissionEntity[];
}