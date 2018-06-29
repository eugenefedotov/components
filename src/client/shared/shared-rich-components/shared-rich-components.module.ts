import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {SharedServicesModule} from '../shared-services/shared-services.module';
import {SharedDirectivesModule} from '../shared-directives/shared-directives.module';
import {PaymentServiceCurrencyListComponent} from './payment-service-currency-list/payment-service-currency-list.component';
import { PaymentServiceCurrencyComponent } from './payment-service-currency/payment-service-currency.component';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        SharedServicesModule,
        SharedDirectivesModule
    ],
    declarations: [
        HeaderComponent,
        PaymentServiceCurrencyListComponent,
        PaymentServiceCurrencyComponent
    ],
    exports: [
        HeaderComponent,
        PaymentServiceCurrencyListComponent
    ]
})
export class SharedRichComponentsModule {
}
