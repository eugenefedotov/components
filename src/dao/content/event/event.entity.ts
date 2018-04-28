import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {EventVersionEntity} from "./event-version.entity";

@Entity('event')
export class EventEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @OneToOne(type => EventVersionEntity, {eager: true})
    @JoinColumn()
    currentVersion: EventVersionEntity;

    @OneToMany(type => EventVersionEntity, object => object.event)
    history: EventVersionEntity[];
}