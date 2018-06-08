import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './components/blocks/authentication/authentication.component';
import {HeaderComponent} from './components/blocks/header/header.component';
import {ScrollBoxComponent} from './components/base/scroll-box/scroll-box.component';
import {ScrollBarComponent} from './components/base/scroll-bar/scroll-bar.component';
import {WindowComponent} from './components/base/window/window.component';
import {DialogComponent} from './components/base/dialog/dialog.component';
import {ButtonComponent} from './components/base/button/button.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {HeaderMenuComponent} from './components/blocks/header-menu/header-menu.component';
import {RouterModule} from '@angular/router';
import {OrganizationComponent} from './components/entity-views/organization/organization.component';
import {PersonComponent} from './components/entity-views/person/person.component';
import { WaiterComponent } from './components/base/waiter/waiter.component';
import { InputWrapperComponent } from './components/base/input-wrapper/input-wrapper.component';
import { SelectComponent } from './components/base/select/select.component';
import { VirtualListComponent } from './components/base/virtual-list/virtual-list.component';
import { SpinnerComponent } from './components/base/spinner/spinner.component';

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
        HeaderMenuComponent,
        OrganizationComponent,
        PersonComponent,
        WaiterComponent,
        InputWrapperComponent,
        SelectComponent,
        VirtualListComponent,
        SpinnerComponent
    ],
    exports: [
        AuthenticationComponent,
        HeaderComponent,
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        InputWrapperComponent
    ],
    entryComponents: [
        WindowComponent,
        DialogComponent,
        WaiterComponent
    ]
})
export class SharedComponentsModule {
}
