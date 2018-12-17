import {RouterModule} from '@angular/router';

export const CLIENT_ROUTER_MODULE = RouterModule.forRoot([
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'demo'
    },
    {
        path: 'demo',
        loadChildren: 'client/demo/demo.module#DemoModule'
    }
]);
