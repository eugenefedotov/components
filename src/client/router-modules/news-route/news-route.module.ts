import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewsComponent} from './components/news/news.component';
import {NEWS_ROUTE_ROUTER_MODULE} from './news-route.router-module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        NEWS_ROUTE_ROUTER_MODULE
    ],
    declarations: [NewsComponent]
})
export class NewsRouteModule {
}
