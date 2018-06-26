import {RouterModule} from '@angular/router';
import {HeaderComponent} from '../shared/shared-rich-components/header/header.component';
import {AppComponent} from './app.component';

export const APP_ROUTER_MODULE = RouterModule.forChild([
    {
        path: '',
        component: AppComponent,
        children: [
            {
                outlet: 'header',
                path: '',
                component: HeaderComponent
            },
            {
                path: '',
                redirectTo: 'news',
                pathMatch: 'full'
            },
            {
                path: 'news',
                loadChildren: 'client/app/news/news.module#NewsModule'
            }
        ]
    }
]);
