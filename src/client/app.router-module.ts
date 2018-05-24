import {RouterModule} from '@angular/router';

export const APP_ROUTER_MODULE = RouterModule.forRoot([
    {
        path: '',
        loadChildren: 'client/router-modules/router-modules.module#RouterModulesModule'
    }
]);