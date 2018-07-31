import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentServiceEntity} from '../payment-service/payment-service.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('payment_service_account')
export class PaymentServiceAccountEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Type(type => PaymentServiceEntity)
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
