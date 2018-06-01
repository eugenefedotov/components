import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PopUpService {
    private viewContainerRef: ViewContainerRef;

    constructor() {
    }

    setViewContainerRef(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }

    insertComponent(componentRef: ComponentRef<any>) {
        this.viewContainerRef.insert(componentRef.hostView);
    }
}
