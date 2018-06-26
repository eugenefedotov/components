import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component';
import {SharedModule} from '../shared/shared.module';
import {DEMO_ROUTER_MODULE} from './demo.router-module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DEMO_ROUTER_MODULE
    ],
    declarations: [DemoComponent]
})
export class DemoModule {
}
