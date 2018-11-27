import {Column, PrimaryGeneratedColumn} from 'typeorm';

export abstract class PaymentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unsigned: true, type: 'double', nullable: false})
    sum: number;
}
