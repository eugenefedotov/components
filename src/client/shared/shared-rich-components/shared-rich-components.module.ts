import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './authentication/authentication.component';
import {HeaderComponent} from './header/header.component';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {SharedServicesModule} from '../shared-services/shared-services.module';
import {SharedDirectivesModule} from '../shared-directives/shared-directives.module';
import {SandboxComponent} from './sandbox/sandbox.component';

@NgModule({
    imports: [
        CommonModule,
        SharedComponentsModule,
        SharedServicesModule,
        SharedDirectivesModule
    ],
    declarations: [
        AuthenticationComponent,
        HeaderComponent,
        SandboxComponent
    ],
    exports: [
        AuthenticationComponent,
        HeaderComponent,
        SandboxComponent
    ]
})
export class SharedRichComponentsModule {
}
