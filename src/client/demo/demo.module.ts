import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component';
import {DEMO_ROUTER_MODULE} from './demo.router-module';
import { DemoGridComponent } from './components/demo-grid/demo-grid.component';
import {SharedComponentsModule} from '../shared/shared-components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        DEMO_ROUTER_MODULE
    ],
    declarations: [DemoComponent, DemoGridComponent]
})
export class DemoModule {
}
