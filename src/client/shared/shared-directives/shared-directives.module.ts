import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopUpDirective} from './pop-up/pop-up.directive';
import {TooltipDirective} from './tooltip/tooltip.directive';
import {InjectComponentDirective} from './inject-component/inject-component.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PopUpDirective,
        TooltipDirective,
        InjectComponentDirective
    ],
    exports: [
        PopUpDirective,
        TooltipDirective,
        InjectComponentDirective
    ]
})
export class SharedDirectivesModule {
}
