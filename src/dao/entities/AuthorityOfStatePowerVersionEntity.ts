import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {AuthorityOfStatePowerEntity} from './AuthorityOfStatePowerEntity';

@Entity('authority_of_state_power_version')
export class AuthorityOfStatePowerVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => AuthorityOfStatePowerEntity)
    authorityOfStatePower: AuthorityOfStatePowerEntity;

    @ManyToOne(type => AuthorityOfStatePowerEntity)
    parent: AuthorityOfStatePowerEntity;

    @OneToMany(type => AuthorityOfStatePowerEntity, object => object.currentVersion)
    children: AuthorityOfStatePowerEntity[];

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;
}