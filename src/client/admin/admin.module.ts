import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './admin.component';
import {SharedComponentsModule} from '../shared/shared-components/shared-components.module';
import {ADMIN_ROUTER_MODULE} from './admin.router-module';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        ADMIN_ROUTER_MODULE
    ],
    declarations: [AdminComponent]
})
export class AdminModule {
}
