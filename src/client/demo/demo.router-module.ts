import {RouterModule} from '@angular/router';
import {DemoComponent} from './demo.component';

export const DEMO_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: DemoComponent
    }
]);
