import {RouterModule} from '@angular/router';
import {HeaderComponent} from '../shared/shared-rich-components/header/header.component';
import {ExchangerComponent} from './exchanger.component';
import {ExchangeRoutesComponent} from './exchange-routes/exchange-routes.component';
import {ExchangeInitComponent} from './exchange-init/exchange-init.component';
import {ExchangeInitResolverService} from './exchange-init/exchange-init-resolver/exchange-init-resolver.service';
import {ExchangeStatusResolverService} from './exchange-status/exchange-status-resolver/exchange-status-resolver.service';
import {ExchangeStatusComponent} from './exchange-status/exchange-status.component';

export const EXCHANGER_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: ExchangerComponent,
        data: {
            title: 'Обменник'
        },
        children: [
            {
                outlet: 'header',
                path: '',
                component: HeaderComponent
            },
            {
                path: '',
                component: ExchangeRoutesComponent
            },
            {
                path: 'exchange-init/:from/:to',
                component: ExchangeInitComponent,
                resolve: {
                    params: ExchangeInitResolverService
                }
            },
            {
                path: 'exchange-status/:uuid',
                component: ExchangeStatusComponent,
                resolve: {
                    params: ExchangeStatusResolverService
                }
            }
        ]
    }
]);
