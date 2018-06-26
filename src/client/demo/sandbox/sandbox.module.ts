import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SandboxComponent} from './sandbox.component';
import {SANDBOX_ROUTER_MODULE} from './sandbox.router-module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SANDBOX_ROUTER_MODULE
    ],
    declarations: [SandboxComponent]
})
export class SandboxModule {
}
