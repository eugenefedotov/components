import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {distinct, map, share} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PopUpService {
    private viewContainerRef: ViewContainerRef;
    private lockComponents$ = new BehaviorSubject<ComponentRef<any>[]>([]);

    constructor() {
    }

    get lock$(): Observable<boolean> {
        return this.lockComponents$.pipe(
            map(components => !!components.length),
            distinct(),
            share()
        );
    }

    setViewContainerRef(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }

    insertComponent(componentRef: ComponentRef<any>, lockApp = false) {
        if (lockApp) {
            this.lockComponents$.next([...this.lockComponents$.value, componentRef]);
            componentRef.onDestroy(() =>
                this.lockComponents$.next(this.lockComponents$.value.filter(value => value !== componentRef))
            );
        }

        this.viewContainerRef.insert(componentRef.hostView);
    }
}
