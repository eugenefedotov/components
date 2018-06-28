import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';

@Entity('payment_service_account')
export class PaymentServiceAccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PaymentServiceEntity, {nullable: true, onDelete: 'CASCADE', eager: true})
    paymentService: PaymentServiceEntity;

    @Column()
    @Index()
    login: string;

    @Column()
    password: string;

    @Column({default: false})
    @Index()
    isEnabled: boolean;
}
