import {Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Type} from 'serializer.ts/Decorators';
import {PaymentServiceRequisiteTypeEntity} from '../payment-service-requisite-type/payment-service-requisite-type.entity';

@Entity(`settings`)
export class SettingsEntity {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({default: false, comment: 'Включен'})
    @Index()
    isEnabled: boolean;
    //
    // @Type(type => PaymentServiceRequisiteTypeEntity)
    // @ManyToMany(type => PaymentServiceRequisiteTypeEntity, {eager: true}) // todo потенциально тяжелый запрос
    // @JoinTable({name: `settings__enable_incoming`})
    // incomingPaymentServiceCurrency: PaymentServiceRequisiteTypeEntity[];
}
