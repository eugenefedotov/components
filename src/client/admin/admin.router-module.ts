import {RouterModule} from '@angular/router';
import {AdminComponent} from './admin.component';

export const ADMIN_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: AdminComponent
    }
]);
