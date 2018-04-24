import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('person')
export class PersonEntity {

    @PrimaryGeneratedColumn()
    id: number;

}