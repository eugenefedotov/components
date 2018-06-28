import {RouterModule} from '@angular/router';
import {HeaderComponent} from '../shared/shared-rich-components/header/header.component';
import {ExchangerComponent} from './exchanger.component';
import {ExchangeRoutesComponent} from './exchange-routes/exchange-routes.component';
import {ExchangeRouteComponent} from './exchange-route/exchange-route.component';

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
                pathMatch: 'full',
                component: ExchangeRoutesComponent
            }
        ]
    }
]);
