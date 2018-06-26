import {RouterModule} from '@angular/router';
import {DemoComponent} from './demo.component';

export const DEMO_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: DemoComponent,
        children: [
            {
                path: 'sandbox',
                loadChildren: 'client/demo/sandbox/sandbox.module#SandboxModule'
            }
        ]
    }
]);
