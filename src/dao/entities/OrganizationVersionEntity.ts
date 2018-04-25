import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationEntity} from './OrganizationEntity';

@Entity('authority_of_state_power_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class OrganizationVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => OrganizationEntity)
    organization: OrganizationEntity;

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;
}