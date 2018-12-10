import {Column, PrimaryGeneratedColumn} from 'typeorm';
import {Type} from 'serializer.ts/Decorators';

export abstract class PaymentEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Type(type => Date)
    @Column({
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP'
    })
    date: Date;

    @Column({unsigned: true, type: 'double', nullable: false})
    sum: number;
}
