import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './blocks/authentication/authentication.component';
import {HeaderComponent} from './blocks/header/header.component';
import {ScrollBoxComponent} from './base/scroll-box/scroll-box.component';
import {ScrollBarComponent} from './base/scroll-bar/scroll-bar.component';
import {WindowComponent} from './base/window/window.component';
import {DialogComponent} from './base/dialog/dialog.component';
import {ButtonComponent} from './base/button/button.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {HeaderMenuComponent} from './blocks/header-menu/header-menu.component';
import {RouterModule} from '@angular/router';
import {OrganizationComponent} from './entity-views/organization/organization.component';
import {PersonComponent} from './entity-views/person/person.component';
import {WaiterComponent} from './base/waiter/waiter.component';
import {InputWrapperComponent} from './base/input-wrapper/input-wrapper.component';
import {SelectComponent} from './base/select/select.component';
import {VirtualListComponent} from './base/virtual-list/virtual-list.component';
import {SpinnerComponent} from './base/spinner/spinner.component';
import {TabSwitcherComponent} from './base/tab-switcher/tab-switcher.component';
import {TabSetComponent} from './base/tab-set/tab-set.component';
import {TabSetTabComponent} from './base/tab-set-tab/tab-set-tab.component';
import {RadioComponent} from './base/radio/radio.component';
import {PopUpContainerComponent} from './base/pop-up-container/pop-up-container.component';

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
        SpinnerComponent,
        TabSwitcherComponent,
        TabSetComponent,
        TabSetTabComponent,
        RadioComponent,
        PopUpContainerComponent
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
        WaiterComponent,
        PopUpContainerComponent
    ]
})
export class SharedComponentsModule {
}
