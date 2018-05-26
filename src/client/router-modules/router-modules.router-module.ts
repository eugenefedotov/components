import {RouterModule} from '@angular/router';

export const ROUTER_MODULES_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full'
    },
    {
        path: 'news',
        loadChildren: 'client/router-modules/news-route/news-route.module#NewsRouteModule'
    }
]);