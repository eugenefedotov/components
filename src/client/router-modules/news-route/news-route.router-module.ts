import {RouterModule} from '@angular/router';
import {NewsComponent} from './components/news/news.component';

export const NEWS_ROUTE_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: NewsComponent
    }
]);