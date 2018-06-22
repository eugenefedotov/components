import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopUpDirective} from './pop-up/pop-up.directive';
import {TooltipDirective} from './tooltip/tooltip.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PopUpDirective, TooltipDirective],
    exports: [PopUpDirective, TooltipDirective]
})
export class SharedDirectivesModule {
}
