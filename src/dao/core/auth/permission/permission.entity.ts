import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PermissionGroupEntity} from '../permission-group/permission-group.entity';

@Entity('permission')
export class PermissionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({unique: true, nullable: false})
    code: string;

    @Column()
    name: string;

    @ManyToMany(type => PermissionEntity)
    @JoinTable()
    dependencies: PermissionEntity[];

    @ManyToOne(type => PermissionGroupEntity, {nullable: false})
    group: PermissionGroupEntity;
}