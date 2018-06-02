import {Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent} from 'typeorm';

@Entity('menu')
@Tree('nested-set')
export class MenuEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @TreeChildren()
    children: MenuEntity[];

    @TreeParent()
    parent: MenuEntity;
}