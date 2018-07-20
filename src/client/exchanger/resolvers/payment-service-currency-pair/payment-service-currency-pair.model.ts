import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';

export interface PaymentServiceCurrencyPairModel {
    from: PaymentServiceCurrencyEntity;
    to: PaymentServiceCurrencyEntity;
}
