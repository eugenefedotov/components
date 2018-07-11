import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('payment_service')
export class PaymentServiceEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column()
    name: string;

    @Column({
        unique: true
    })
    code: string;

    @Column({default: false, comment: 'Сервис работает с собственной валютой'})
    isIndependent: boolean;

    @Column({default: false, comment: 'Включен'})
    @Index()
    isEnabled: boolean;

    @Column({
        comment: 'Рассчетное время транзакции (в минутах)',
        default: 0
    })
    durationMinutes: number = 0;
}
