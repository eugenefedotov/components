import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './components/authentication/authentication.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {ScrollBoxComponent} from './components/scroll-box/scroll-box.component';
import {ScrollBarComponent} from './components/scroll-bar/scroll-bar.component';
import {WindowComponent} from './components/window/window.component';
import {DialogComponent} from './components/dialog/dialog.component';
import { ButtonComponent } from './components/button/button.component';
import { PopUpRenderPlaceComponent } from './components/pop-up-render-place/pop-up-render-place.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent,
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        PopUpRenderPlaceComponent
    ],
    exports: [
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent,
        ScrollBoxComponent,
        ScrollBarComponent,
        WindowComponent,
        DialogComponent,
        ButtonComponent,
        PopUpRenderPlaceComponent
    ]
})
export class SharedComponentsModule {
}
