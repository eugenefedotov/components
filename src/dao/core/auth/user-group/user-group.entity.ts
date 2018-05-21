import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from '../user/user.entity';
import {PermissionEntity} from '../permission/permission.entity';

@Entity('user_group')
export class UserGroupEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => UserGroupEntity)
    @JoinTable()
    dependencies: UserGroupEntity[];

    @ManyToMany(type => UserEntity, object => object.groups)
    users: UserEntity[];

    @ManyToMany(type => PermissionEntity)
    @JoinTable()
    permissions: PermissionEntity[];
}