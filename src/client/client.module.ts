import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ClientComponent} from './client.component';
import {CLIENT_ROUTER_MODULE} from './client.router-module';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        ClientComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        CLIENT_ROUTER_MODULE
    ],
    providers: [],
    bootstrap: [ClientComponent]
})
export class ClientModule {
}
