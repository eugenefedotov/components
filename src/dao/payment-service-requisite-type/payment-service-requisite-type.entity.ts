import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('payment_service_requisite_type')
export class PaymentServiceRequisiteTypeEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;
}
