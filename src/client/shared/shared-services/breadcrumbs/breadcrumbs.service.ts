import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {filter, map, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {BreadcrumbModel} from '../../shared-models/breadcrumb.model';

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbsService {

    readonly items$: Observable<BreadcrumbModel[]>;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.items$ = router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map((neEvent: NavigationEnd) => this.getBreadcrumbs(neEvent, route.snapshot)),
            shareReplay(1)
        );
    }

    private getBreadcrumbs(neEvent: NavigationEnd, snapshot: ActivatedRouteSnapshot): BreadcrumbModel[] {
        return [];
    }
}
