import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {APP_ROUTER_MODULE} from './app.router-module';
import { AppComponent } from './app.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        APP_ROUTER_MODULE
    ],
    declarations: [AppComponent]
})
export class AppModule {
}
