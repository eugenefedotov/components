import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProofEntity} from './ProofEntity';

@Entity('proof_version')
export class ProofVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => ProofEntity)
    proof: ProofEntity;

    @Column('datetime')
    dateSave: Date;
}