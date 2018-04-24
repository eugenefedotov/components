import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {AuthorityOfStatePowerVersionEntity} from './AuthorityOfStatePowerVersionEntity';

@Entity('authority_of_state_power')
export class AuthorityOfStatePowerEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => AuthorityOfStatePowerVersionEntity)
    @JoinColumn()
    currentVersion: AuthorityOfStatePowerVersionEntity;

    @OneToMany(type => AuthorityOfStatePowerVersionEntity, object => object.authorityOfStatePower)
    history: AuthorityOfStatePowerVersionEntity[];
}