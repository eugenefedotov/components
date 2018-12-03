import {CurrencyController} from './currency.controller';
import {ExchangeController} from './exchange.controller';
import {ExchangeRouteController} from './exchange-route.controller';
import {PaymentServiceController} from './payment-service.controller';
import {PaymentServiceCurrencyController} from './payment-service-currency.controller';

export const API_CONTROLLERS = [
    CurrencyController,
    ExchangeController,
    ExchangeRouteController,
    PaymentServiceController,
    PaymentServiceCurrencyController
];
