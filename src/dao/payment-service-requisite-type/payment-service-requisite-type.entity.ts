import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {MaskEntity} from '../mask/mask.entity';
import {Type} from 'serializer.ts/Decorators';

@Entity('payment_service_requisite_type')
export class PaymentServiceRequisiteTypeEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @Type(type => MaskEntity)
    @ManyToOne(type => MaskEntity, {eager: true})
    mask: MaskEntity;
}
