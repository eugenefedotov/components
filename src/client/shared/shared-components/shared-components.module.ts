import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './components/authentication/authentication.component';
import {HeaderComponent} from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollBoxComponent } from './components/scroll-box/scroll-box.component';
import { ScrollBarComponent } from './components/scroll-bar/scroll-bar.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent,
        ScrollBoxComponent,
        ScrollBarComponent
    ],
    exports: [
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent,
        ScrollBoxComponent,
        ScrollBarComponent
    ]
})
export class SharedComponentsModule {
}
