import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('authority_scope')
export class AuthorityScopeEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;
}