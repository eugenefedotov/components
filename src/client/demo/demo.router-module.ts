import {RouterModule} from '@angular/router';
import {DemoComponent} from './demo.component';
import {SandboxComponent} from './sandbox/sandbox.component';
import {ShowcaseComponent} from './showcase/showcase.component';
import {SandboxComponentResolverService} from './sandbox/sandbox-component-resolver/sandbox-component-resolver.service';

export const DEMO_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: DemoComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ShowcaseComponent
            },
            {
                path: 'sandbox/:component/:preset',
                component: SandboxComponent,
                resolve: {
                    componentInfo: SandboxComponentResolverService
                }
            },
            {
                path: 'sandbox/:component',
                component: SandboxComponent,
                resolve: {
                    componentInfo: SandboxComponentResolverService
                }
            }
        ]
    }
]);
