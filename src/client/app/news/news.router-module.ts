import {RouterModule} from '@angular/router';
import {NewsComponent} from './news.component';

export const NEWS_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: NewsComponent,
        data: {
            title: 'News title'
        }
    }
]);
