import {Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {AuthorityOfStatePowerEntity} from './AuthorityOfStatePowerEntity';
import {PositionVersionEntity} from './PositionVersionEntity';

@Entity('position')
export class PositionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => AuthorityOfStatePowerEntity)
    authorityOfStatePower: AuthorityOfStatePowerEntity;

    @OneToOne(type => PositionVersionEntity)
    @JoinColumn()
    currentVersion: PositionVersionEntity;

    @OneToMany(type => PositionVersionEntity, object => object.position)
    history: PositionVersionEntity[];
}