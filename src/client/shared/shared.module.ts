import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedServicesModule} from './shared-services/shared-services.module';
import {SharedComponentsModule} from './shared-components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        SharedServicesModule,
        SharedComponentsModule
    ],
    declarations: [],
    providers: []
})
export class SharedModule {
}
