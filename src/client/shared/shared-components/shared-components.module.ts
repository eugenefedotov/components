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
import { OrganizationComponent } from './components/entity-views/organization/organization.component';
import { PersonOnPositionComponent } from './components/entity-views/person-on-position/person-on-position.component';
import { PositionComponent } from './components/entity-views/position/position.component';
import { PersonComponent } from './components/entity-views/person/person.component';

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
        PersonOnPositionComponent,
        PositionComponent,
        PersonComponent
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
