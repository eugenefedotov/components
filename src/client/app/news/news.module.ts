import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewsComponent} from './news.component';
import {NEWS_ROUTER_MODULE} from './news.router-module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NEWS_ROUTER_MODULE
    ],
    declarations: [NewsComponent]
})
export class NewsModule {
}
