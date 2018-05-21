import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PermissionGroupEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;
}