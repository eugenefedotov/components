import {NgModule} from '@angular/core';
import {SharedServicesModule} from './shared-services/shared-services.module';
import {SharedComponentsModule} from './shared-components/shared-components.module';

@NgModule({
    imports: [
        SharedServicesModule,
        SharedComponentsModule,
    ],
    declarations: [],
    providers: [],
    exports: [
        SharedServicesModule,
        SharedComponentsModule
    ]
})
export class SharedModule {
}
