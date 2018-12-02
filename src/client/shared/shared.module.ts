import {NgModule} from '@angular/core';
import {SharedServicesModule} from './shared-services/shared-services.module';
import {SharedComponentsModule} from './shared-components/shared-components.module';
import {SharedRestServicesModule} from './shared-rest-services/shared-rest-services.module';
import {SharedDirectivesModule} from './shared-directives/shared-directives.module';
import {SharedRichComponentsModule} from './shared-rich-components/shared-rich-components.module';
import {SharedPipesModule} from './shared-pipes/shared-pipes.module';

@NgModule({
    imports: [
        SharedServicesModule,
        SharedPipesModule,
        SharedComponentsModule,
        SharedRestServicesModule,
        SharedDirectivesModule,
        SharedRichComponentsModule
    ],
    declarations: [],
    providers: [],
    exports: [
        SharedServicesModule,
        SharedPipesModule,
        SharedComponentsModule,
        SharedRestServicesModule,
        SharedDirectivesModule,
        SharedRichComponentsModule
    ]
})
export class SharedModule {
}
