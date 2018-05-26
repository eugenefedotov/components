import {RouterModule} from '@angular/router';
import {HeaderComponent} from './shared/shared-components/components/header/header.component';
import {FooterComponent} from './shared/shared-components/components/footer/footer.component';

export const APP_ROUTER_MODULE = RouterModule.forRoot([
    {
        outlet: 'header',
        path: '',
        component: HeaderComponent
    },
    {
        outlet: 'footer',
        path: '',
        component: FooterComponent
    },
    {
        path: '',
        loadChildren: 'client/router-modules/router-modules.module#RouterModulesModule'
    }
]);