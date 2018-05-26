import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewsComponent} from './components/news/news.component';
import {NEWS_ROUTE_ROUTER_MODULE} from './news-route.router-module';

@NgModule({
    imports: [
        CommonModule,
        NEWS_ROUTE_ROUTER_MODULE
    ],
    declarations: [NewsComponent]
})
export class NewsRouteModule {
}
