import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationVersionEntity} from './organization-version.entity';

@Entity('authority_of_state_power')
export class OrganizationEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => OrganizationVersionEntity, {eager: true})
    @JoinColumn()
    currentVersion: OrganizationVersionEntity;

    @OneToMany(type => OrganizationVersionEntity, object => object.organization)
    history: OrganizationVersionEntity[];
}