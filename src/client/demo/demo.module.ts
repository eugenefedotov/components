import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component';
import {SharedModule} from '../shared/shared.module';
import {DEMO_ROUTER_MODULE} from './demo.router-module';
import {SandboxComponent} from './sandbox/sandbox.component';
import {ShowcaseComponent} from './showcase/showcase.component';
import {SandboxComponentResolverService} from './sandbox/sandbox-component-resolver/sandbox-component-resolver.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DEMO_ROUTER_MODULE
    ],
    declarations: [
        DemoComponent,
        SandboxComponent,
        ShowcaseComponent
    ],
    providers: [
        SandboxComponentResolverService
    ]
})
export class DemoModule {
}
