import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {SharedServicesModule} from '../shared-services/shared-services.module';
import {SharedDirectivesModule} from '../shared-directives/shared-directives.module';
import {PaymentServiceCurrencyListComponent} from './payment-service-currency-list/payment-service-currency-list.component';
import {PaymentServiceCurrencyComponent} from './payment-service-currency/payment-service-currency.component';
import {ExchangeRouteComponent} from './exchange-route/exchange-route.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {PaymentServiceCurrencyBlockComponent} from './payment-service-currency-block/payment-service-currency-block.component';
import {CurrencyComponent} from './currency/currency.component';
import {PaymentServiceComponent} from './payment-service/payment-service.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExchangeInfoComponent} from './exchange-info/exchange-info.component';
import {SharedPipesModule} from '../shared-pipes/shared-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Angular2FontawesomeModule,
        SharedComponentsModule,
        SharedServicesModule,
        SharedDirectivesModule,
        SharedPipesModule
    ],
    declarations: [
        HeaderComponent,
        PaymentServiceCurrencyListComponent,
        PaymentServiceCurrencyComponent,
        ExchangeRouteComponent,
        PaymentServiceCurrencyBlockComponent,
        CurrencyComponent,
        PaymentServiceComponent,
        ExchangeInfoComponent
    ],
    exports: [
        HeaderComponent,
        PaymentServiceCurrencyListComponent,
        ExchangeRouteComponent,
        PaymentServiceCurrencyBlockComponent,
        CurrencyComponent,
        PaymentServiceComponent,
        ExchangeInfoComponent
    ]
})
export class SharedRichComponentsModule {
}
