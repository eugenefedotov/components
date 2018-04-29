import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {PersonOnPositionEntity} from './person-on-position.entity';
import {PersonEntity} from '../person/person.entity';
import {PositionEntity} from '../position/position.entity';
import {EventEntity} from '../event/event.entity';
import {ProofEntity} from '../proof/proof.entity';
import {VoteEntity} from "../vote/vote.entity";
import {UserEntity} from "../../core/auth/user/user.entity";
import {AuthorityScopeEntity} from "../authority-scope/authority-scope.entity";

@Entity('person_on_position_version')
@Index('date_interval', ['dateBegin', 'dateEnd'])
export class PersonOnPositionVersionEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column('timestamp', {default: () => 'CURRENT_TIMESTAMP'})
    insertDate: Date;

    @OneToOne(type => UserEntity, {eager: true})
    @JoinColumn()
    insertUser: UserEntity;

    @ManyToOne(type => PersonOnPositionEntity, {eager: true})
    personOnPosition: PersonOnPositionEntity;

    @ManyToOne(type => PersonEntity, {eager: true})
    person: PersonEntity;

    @ManyToOne(type => PositionEntity, {eager: true})
    position: PositionEntity;

    @Column('date', {nullable: true})
    beginDate: Date;

    @Column('date', {nullable: true})
    endDate: Date;

    @ManyToMany(type => EventEntity)
    @JoinTable()
    events: EventEntity[];

    @ManyToMany(type => ProofEntity)
    @JoinTable()
    proofs: ProofEntity[];

    @ManyToMany(type => VoteEntity)
    @JoinTable()
    votes: VoteEntity[];

    @ManyToMany(type => AuthorityScopeEntity)
    @JoinTable()
    scopes: AuthorityScopeEntity[];
}