import {Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {OrganizationEntity} from './OrganizationEntity';
import {PositionEntity} from "./PositionEntity";
import {ProofEntity} from "./ProofEntity";
import {EventEntity} from "./EventEntity";

@Entity('authority_of_state_power_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class OrganizationVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => OrganizationEntity)
    organization: OrganizationEntity;

    @OneToMany(type => PositionEntity, object => object.organization)
    positions: PositionEntity[];

    @Column('date', {nullable: true})
    dateBegin: Date;

    @Column('date', {nullable: true})
    dateEnd: Date;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    proofs: ProofEntity[];
}