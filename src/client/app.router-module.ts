import {RouterModule} from '@angular/router';
import {HeaderComponent} from './shared/shared-components/blocks/header/header.component';

export const APP_ROUTER_MODULE = RouterModule.forRoot([
    {
        outlet: 'header',
        path: '',
        component: HeaderComponent
    },
    {
        path: '',
        loadChildren: 'client/router-modules/router-modules.module#RouterModulesModule'
    }
]);
