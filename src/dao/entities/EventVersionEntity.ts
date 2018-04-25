import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {EventEntity} from "./EventEntity";
import {ProofEntity} from "./ProofEntity";

@Entity('event_version')
export class EventVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => EventEntity)
    event: EventEntity;

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;

    @Column('datetime')
    dateSave: Date;

    @ManyToMany(type => ProofEntity)
    proofs: ProofEntity[];
}