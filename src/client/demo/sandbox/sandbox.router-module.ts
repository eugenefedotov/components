import {RouterModule} from '@angular/router';
import {SandboxComponent} from './sandbox.component';

export const SANDBOX_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '../'
    },
    {
        path: ':component/:preset',
        component: SandboxComponent
    },
    {
        path: ':component',
        component: SandboxComponent
    }
]);
