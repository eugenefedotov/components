import {Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserGroupEntity} from '../user-group/user-group.entity';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToMany(type => UserGroupEntity)
    @JoinTable()
    groups: UserGroupEntity[];

}