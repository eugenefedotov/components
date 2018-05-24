import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {APP_ROUTER_MODULE} from './app.router-module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SharedModule,
        APP_ROUTER_MODULE
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
