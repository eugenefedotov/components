import {Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from './UserEntity';
import {UserPermissionEntity} from './UserPermissionEntity';

@Entity('user_group')
export class UserGroupEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToMany(type => UserEntity, object => object.groups)
    users: UserEntity[];

    @ManyToMany(type => UserPermissionEntity)
    @JoinTable()
    permissions: UserPermissionEntity[];
}