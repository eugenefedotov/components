import {Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UserEntity} from '../../core/auth/user/user.entity';
import {AuthorityScopeEntity} from '../authority-scope/authority-scope.entity';
import {AuthorityLevelEntity} from '../authority-level/authority-level.entity';

@Entity('authority')
export class AuthorityEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(type => AuthorityScopeEntity, {eager: true})
    scope: AuthorityScopeEntity;

    @ManyToOne(type => AuthorityLevelEntity, {eager: true})
    level: AuthorityLevelEntity;
}