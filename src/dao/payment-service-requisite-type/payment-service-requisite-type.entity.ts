import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ValidatorEntity} from '../validator/validator.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('payment_service_requisite_type')
export class PaymentServiceRequisiteTypeEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @Type(type => ValidatorEntity)
    @ManyToOne(type => ValidatorEntity, {eager: true})
    validator: ValidatorEntity;
}
