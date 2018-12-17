import {NgModule} from '@angular/core';
import {SharedServicesModule} from './shared-services/shared-services.module';
import {SharedComponentsModule} from './shared-components/shared-components.module';
import {SharedDirectivesModule} from './shared-directives/shared-directives.module';
import {SharedPipesModule} from './shared-pipes/shared-pipes.module';

@NgModule({
    imports: [
        SharedServicesModule,
        SharedPipesModule,
        SharedComponentsModule,
        SharedDirectivesModule
    ],
    declarations: [],
    providers: [],
    exports: [
        SharedServicesModule,
        SharedPipesModule,
        SharedComponentsModule,
        SharedDirectivesModule
    ]
})
export class SharedModule {
}
