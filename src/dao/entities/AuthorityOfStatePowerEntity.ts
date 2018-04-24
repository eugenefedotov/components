import {Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent} from 'typeorm';

@Entity('authority_of_state_power')
@Tree('closure-table')
export class AuthorityOfStatePowerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @TreeParent()
    parent: AuthorityOfStatePowerEntity;

    @TreeChildren()
    children: AuthorityOfStatePowerEntity[];

    @Column()
    dateBegin: Date;

    @Column()
    dateEnd: Date;
}