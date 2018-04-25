import {Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationEntity} from '../organization/OrganizationEntity';
import {PositionVersionEntity} from './PositionVersionEntity';

@Entity('position')
export class PositionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => OrganizationEntity)
    organization: OrganizationEntity;

    @OneToOne(type => PositionVersionEntity)
    @JoinColumn()
    currentVersion: PositionVersionEntity;

    @OneToMany(type => PositionVersionEntity, object => object.position)
    history: PositionVersionEntity[];
}