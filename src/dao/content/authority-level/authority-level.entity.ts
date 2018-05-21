import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('authority_level')
export class AuthorityLevelEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @Column({unsigned: true})
    weight: number;
}