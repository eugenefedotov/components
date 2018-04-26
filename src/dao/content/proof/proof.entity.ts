import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProofVersionEntity} from './proof-version.entity';

@Entity('proof')
export class ProofEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => ProofVersionEntity)
    @JoinColumn()
    currentVersion: ProofVersionEntity;

    @OneToMany(type => ProofVersionEntity, object => object.proof)
    history: ProofVersionEntity[];
}