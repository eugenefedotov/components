import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('currency')
export class CurrencyEntity {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({
        nullable: true
    })
    name: string;

    @Column({
        unique: true
    })
    code: string;

    @Column({
        nullable: true,
        unique: true,
        unsigned: true
    })
    iso4217_num3: number;

    @Column({
        length: 3,
        nullable: true,
        unique: true
    })
    iso4217_code3: string;

    @Column({default: false, comment: 'Валюта работает только со своим сервисом'})
    isIndependent: boolean;

    @Column({default: false})
    isEnabled: boolean;

    @Column({
        nullable: true
    })
    prefix: string;

    @Column({
        nullable: true
    })
    suffix: string;
}
