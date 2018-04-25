import {Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserGroupEntity} from './UserGroupEntity';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToMany(type => UserGroupEntity)
    @JoinTable()
    groups: UserGroupEntity[];

}