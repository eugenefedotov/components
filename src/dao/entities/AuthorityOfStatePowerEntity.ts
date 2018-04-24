import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('authority_of_state_power')
export class AuthorityOfStatePowerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dateBegin: Date;

    @Column()
    dateEnd: Date;
}