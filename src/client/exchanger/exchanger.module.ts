import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EXCHANGER_ROUTER_MODULE} from './exchanger.router-module';
import {ExchangerComponent} from './exchanger.component';
import {SharedModule} from '../shared/shared.module';
import {ExchangeRoutesComponent} from './exchange-routes/exchange-routes.component';
import {ExchangeInitComponent} from './exchange-init/exchange-init.component';
import {ExchangeInitResolverService} from './exchange-init/exchange-init-resolver/exchange-init-resolver.service';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        EXCHANGER_ROUTER_MODULE
    ],
    declarations: [
        ExchangerComponent,
        ExchangeRoutesComponent,
        ExchangeInitComponent,
    ],
    providers: [
        ExchangeInitResolverService
    ]
})
export class ExchangerModule {
}
