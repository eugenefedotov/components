import {Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PositionEntity} from './PositionEntity';

@Entity('position_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class PositionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @ManyToOne(type => PositionEntity)
    position: PositionEntity;

    @ManyToOne(type => PositionEntity)
    parent: PositionEntity;

    @OneToMany(type => PositionEntity, object => object.currentVersion)
    children: PositionEntity[];

    @Column('date')
    dateBegin: Date;

    @Column('date')
    dateEnd: Date;
}