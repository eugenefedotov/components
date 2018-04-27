import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationTypeVersionEntity} from './organization-type-version.entity';

@Entity('organization_type')
export class OrganizationTypeEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => OrganizationTypeVersionEntity)
    @JoinColumn()
    currentVersion: OrganizationTypeVersionEntity;

    @OneToMany(type => OrganizationTypeVersionEntity, object => object.organizationType)
    history: OrganizationTypeVersionEntity[];

}