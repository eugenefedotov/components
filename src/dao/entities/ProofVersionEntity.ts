import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProofEntity} from './ProofEntity';
import {EventEntity} from "./EventEntity";

@Entity('proof_version')
export class ProofVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => ProofEntity)
    proof: ProofEntity;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    dateSave: Date;

    @ManyToMany(type => EventEntity)
    events: EventEntity[];
}