import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {PopUpService} from '../../../shared-services/services/pop-up/pop-up.service';
import {Subject} from 'rxjs';
import {PopUpItem} from '../../../shared-services/services/pop-up/models/pop-up-item.class';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-pop-up-render-place',
    template: '',
    styleUrls: ['./pop-up-render-place.component.scss']
})
export class PopUpRenderPlaceComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject();
    private items: PopUpItem[] = [];

    private get el() {
        return this.elementRef.nativeElement;
    }

    constructor(private popUpService: PopUpService,
                private elementRef: ElementRef<HTMLElement>,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.popUpService
            .stack$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(items => this.onPopUpListChange(items));
    }

    onPopUpListChange(items: PopUpItem[]) {
        const toRemove = this.items.filter(item => !items.includes(item));
        const toAppend = items.filter(item => !this.items.includes(item));

        toRemove.forEach(item => this.renderer.removeChild(this.el, item.componentRef.location.nativeElement));
        toAppend.forEach(item => this.renderer.appendChild(this.el, item.componentRef.location.nativeElement));

        this.items = items;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
