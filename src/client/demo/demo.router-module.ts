import {RouterModule} from '@angular/router';
import {DemoComponent} from './demo.component';
import {DemoGridComponent} from './components/demo-grid/demo-grid.component';
import {DemoSelectComponent} from './components/demo-select/demo-select.component';
import {DemoInputComponent} from './components/demo-input/demo-input.component';
import {DemoVirtualListComponent} from './components/demo-virtual-list/demo-virtual-list.component';

export const DEMO_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: DemoComponent,
        children: [
            {
                path: 'grid',
                component: DemoGridComponent
            },
            {
                path: 'select',
                component: DemoSelectComponent
            },
            {
                path: 'input',
                component: DemoInputComponent
            },
            {
                path: 'virtual-list',
                component: DemoVirtualListComponent
            },
        ]
    }
]);
