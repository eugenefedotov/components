import {RouterModule} from '@angular/router';

export const CLIENT_ROUTER_MODULE = RouterModule.forRoot([
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'exchanger'
    },
    {
        path: 'exchanger',
        loadChildren: 'client/exchanger/exchanger.module#ExchangerModule'
    },
    {
        path: 'demo',
        loadChildren: 'client/demo/demo.module#DemoModule'
    }
]);
