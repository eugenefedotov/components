import {RouterModule} from '@angular/router';

export const ROUTER_MODULES_ROUTER_MODULE = RouterModule.forChild([
    {
        path: 'news',
        loadChildren: 'client/router-modules/news-route/news-route.module#NewsRouteModule'
    }
]);