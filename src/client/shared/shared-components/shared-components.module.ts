import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationComponent} from './components/authentication/authentication.component';
import {HeaderComponent} from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent
    ],
    exports: [
        AuthenticationComponent,
        HeaderComponent,
        FooterComponent
    ]
})
export class SharedComponentsModule {
}
