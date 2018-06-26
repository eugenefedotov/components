import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollBoxComponent} from './scroll-box/scroll-box.component';
import {ScrollBarComponent} from './scroll-bar/scroll-bar.component';
import {WindowComponent} from './window/window.component';
import {DialogComponent} from './dialog/dialog.component';
import {ButtonComponent} from './button/button.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {RouterModule} from '@angular/router';
import {WaiterComponent} from './waiter/waiter.component';
import {InputWrapperComponent} from './input-wrapper/input-wrapper.component';
import {SelectComponent} from './select/select.component';
import {VirtualListComponent} from './virtual-list/virtual-list.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {TabSwitcherComponent} from './tab-switcher/tab-switcher.component';
import {TabSetComponent} from './tab-set/tab-set.component';
import {TabSetTabComponent} from './tab-set-tab/tab-set-tab.component';
import {RadioComponent} from './radio/radio.component';
import {PopUpContainerComponent} from './pop-up-container/pop-up-container.component';
import {TooltipComponent} from './tooltip/tooltip.component';
import {SharedDirectivesModule} from '../shared-directives/shared-directives.module';
import {HeaderMenuComponent} from './header-menu/header-menu.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedDirectivesModule,
        Angular2FontawesomeModule
    ],
    declarations: [
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        WaiterComponent,
        InputWrapperComponent,
        SelectComponent,
        VirtualListComponent,
        SpinnerComponent,
        TabSwitcherComponent,
        TabSetComponent,
        TabSetTabComponent,
        RadioComponent,
        PopUpContainerComponent,
        TooltipComponent,
        HeaderMenuComponent,
    ],
    exports: [
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        InputWrapperComponent,
        HeaderMenuComponent,
    ],
    entryComponents: [
        WindowComponent,
        DialogComponent,
        WaiterComponent,
        PopUpContainerComponent,
        TooltipComponent,
    ]
})
export class SharedComponentsModule {
}
