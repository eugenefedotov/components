import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopUpDirective} from './pop-up/pop-up.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PopUpDirective],
    exports: [PopUpDirective]
})
export class SharedDirectivesModule {
}
