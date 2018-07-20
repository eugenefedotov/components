import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EXCHANGER_ROUTER_MODULE} from './exchanger.router-module';
import {ExchangerComponent} from './exchanger.component';
import {SharedModule} from '../shared/shared.module';
import {ExchangeRoutesComponent} from './exchange-routes/exchange-routes.component';
import {PaymentServiceCurrencyPairResolver} from './resolvers/payment-service-currency-pair/payment-service-currency-pair.resolver';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        EXCHANGER_ROUTER_MODULE
    ],
    declarations: [
        ExchangerComponent,
        ExchangeRoutesComponent
    ],
    providers: [
        PaymentServiceCurrencyPairResolver
    ]
})
export class ExchangerModule {
}
