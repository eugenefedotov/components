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
import {SelectComponent} from './select/select.component';
import {VirtualListComponent} from './virtual-list/virtual-list.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {TabSwitcherComponent} from './tab-switcher/tab-switcher.component';
import {TabSetComponent} from './tab-set/tab-set.component';
import {TabComponent} from './tab/tab.component';
import {RadioComponent} from './radio/radio.component';
import {PopUpContainerComponent} from './pop-up-container/pop-up-container.component';
import {TooltipComponent} from './tooltip/tooltip.component';
import {SharedDirectivesModule} from '../shared-directives/shared-directives.module';
import {HeaderMenuComponent} from './header-menu/header-menu.component';
import {SelectItemComponent} from './select-item/select-item.component';
import {ValueWrapperComponent} from './value-wrapper/value-wrapper.component';
import {BlockWrapperComponent} from './block-wrapper/block-wrapper.component';
import {InputComponent} from './input/input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UpdaterComponent} from './updater/updater.component';
import {SharedPipesModule} from '../shared-pipes/shared-pipes.module';
import {GridComponent} from './grid/grid.component';
import { GridViewportComponent } from './grid/grid-viewport/grid-viewport.component';
import { GridRowComponent } from './grid/grid-row/grid-row.component';
import { GridCellComponent } from './grid/grid-cell/grid-cell.component';
import { VirtualGridComponent } from './virtual-grid/virtual-grid.component';
import { ControlErrorComponent } from './control-error/control-error.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SharedPipesModule,
        ReactiveFormsModule,
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
        SelectComponent,
        VirtualListComponent,
        SpinnerComponent,
        TabSwitcherComponent,
        TabSetComponent,
        TabComponent,
        RadioComponent,
        PopUpContainerComponent,
        TooltipComponent,
        HeaderMenuComponent,
        SelectItemComponent,
        ValueWrapperComponent,
        BlockWrapperComponent,
        InputComponent,
        UpdaterComponent,
        GridComponent,
        GridViewportComponent,
        GridRowComponent,
        GridCellComponent,
        VirtualGridComponent,
        ControlErrorComponent,
    ],
    exports: [
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        HeaderMenuComponent,
        VirtualListComponent,
        SelectComponent,
        ValueWrapperComponent,
        BlockWrapperComponent,
        InputComponent,
        UpdaterComponent,
        GridComponent,
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
