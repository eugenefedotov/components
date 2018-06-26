import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './authentication/authentication.component';
import {OrganizationComponent} from './entity-views/organization/organization.component';
import {PersonComponent} from './entity-views/person/person.component';
import {HeaderComponent} from './header/header.component';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {SharedServicesModule} from '../shared-services/shared-services.module';
import {SharedDirectivesModule} from '../shared-directives/shared-directives.module';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        SharedServicesModule,
        SharedDirectivesModule
    ],
    declarations: [
        AuthenticationComponent,
        OrganizationComponent,
        PersonComponent,
        HeaderComponent
    ],
    exports: [
        AuthenticationComponent,
        OrganizationComponent,
        PersonComponent,
        HeaderComponent
    ]
})
export class SharedRichComponentsModule {
}