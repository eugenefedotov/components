import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent} from 'typeorm';
import {AuthorityOfStatePowerEntity} from './AuthorityOfStatePowerEntity';

@Entity('position')
@Tree('closure-table')
export class PositionEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => AuthorityOfStatePowerEntity)
    authorityOfStatePower: AuthorityOfStatePowerEntity;

    @TreeParent()
    head: PositionEntity;

    @TreeChildren()
    subordinates: PositionEntity[];

    @Column()
    dateBegin: Date;

    @Column()
    dateEnd: Date;
}