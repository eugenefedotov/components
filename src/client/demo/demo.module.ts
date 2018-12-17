import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component';
import {DEMO_ROUTER_MODULE} from './demo.router-module';
import { DemoGridComponent } from './components/demo-grid/demo-grid.component';
import {SharedComponentsModule} from '../shared/shared-components/shared-components.module';
import { DemoSelectComponent } from './components/demo-select/demo-select.component';
import { DemoInputComponent } from './components/demo-input/demo-input.component';
import { DemoVirtualListComponent } from './components/demo-virtual-list/demo-virtual-list.component';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        DEMO_ROUTER_MODULE
    ],
    declarations: [DemoComponent, DemoGridComponent, DemoSelectComponent, DemoInputComponent, DemoVirtualListComponent]
})
export class DemoModule {
}
