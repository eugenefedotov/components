import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Data, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {flatten} from '@angular/compiler';
import {Observable} from 'rxjs/internal/Observable';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {

    readonly siteName$ = new BehaviorSubject<string>('');
    readonly title$ = new BehaviorSubject<string>('');

    constructor(private title: Title,
                private router: Router,
                private route: ActivatedRoute) {

        combineLatest(this.siteName$, this.title$)
            .subscribe(names => {
                const globalTitle = names.filter(Boolean).join(': ');
                this.title.setTitle(globalTitle);
            });

        this.router.events.subscribe(e => this.onRouterEvent(e as RouterEvent));
    }

    private onRouterEvent(event: RouterEvent) {
        if (event instanceof NavigationEnd) {
            this.onNavigationEnd(event);
        }
    }

    private onNavigationEnd(event: NavigationEnd) {
        const dataObservables: Observable<Data>[] = [];
        let routes = [this.route];
        do {
            dataObservables.push(...routes.map(route => route.data));
        } while ((routes = flatten(routes.map(route => route.children))) && routes.length);

        combineLatest(dataObservables)
            .subscribe(datas => {
                datas.forEach(data => {
                    if (data.title) {
                        this.title$.next(data.title);
                    }
                });
            });
    }
}
