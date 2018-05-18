import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../core/auth/user/user.entity";
import {AuthorityScopeEntity} from "../authority-scope/authority-scope.entity";

@Entity('authority')
export class AuthorityEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(type => AuthorityScopeEntity)
    scope: AuthorityScopeEntity;

    @Column({unsigned: true})
    weight: number;
}