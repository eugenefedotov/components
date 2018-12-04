import {RouterModule} from '@angular/router';
import {DemoComponent} from './demo.component';
import {DemoGridComponent} from './components/demo-grid/demo-grid.component';

export const DEMO_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: DemoComponent,
        children: [
            {
                path: 'grid',
                component: DemoGridComponent
            }
        ]
    }
]);
