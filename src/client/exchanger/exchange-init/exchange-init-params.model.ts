import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';

export interface ExchangeInitParamsModel {
    from: PaymentServiceCurrencyEntity;
    to: PaymentServiceCurrencyEntity;
}
