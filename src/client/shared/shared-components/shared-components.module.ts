import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './components/authentication/authentication.component';
import {HeaderComponent} from './components/header/header.component';
import {ScrollBoxComponent} from './components/scroll-box/scroll-box.component';
import {ScrollBarComponent} from './components/scroll-bar/scroll-bar.component';
import {WindowComponent} from './components/window/window.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {ButtonComponent} from './components/button/button.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {HeaderMenuComponent} from './components/header-menu/header-menu.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        Angular2FontawesomeModule
    ],
    declarations: [
        AuthenticationComponent,
        HeaderComponent,
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        HeaderMenuComponent
    ],
    exports: [
        AuthenticationComponent,
        HeaderComponent,
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent
    ],
    entryComponents: [
        WindowComponent,
        DialogComponent
    ]
})
export class SharedComponentsModule {
}
