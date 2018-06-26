import {ComponentRef, Directive, Input, OnChanges, SimpleChanges, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[appInjectComponent]'
})
export class InjectComponentDirective implements OnChanges {

    @Input('appInjectComponent') component: ComponentRef<any>;

    constructor(private viewContainerRef: ViewContainerRef) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('component')) {
            this.viewContainerRef.clear();

            if (this.component) {
                this.viewContainerRef.insert(this.component.hostView);
            }
        }
    }


}
