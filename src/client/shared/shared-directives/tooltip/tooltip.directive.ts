import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {TooltipComponent} from '../../shared-components/tooltip/tooltip.component';
import {PopUpService} from '../../shared-services/pop-up/pop-up.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Directive({
    selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {

    @Input('appTooltip') tooltipText: string;
    private component: ComponentRef<TooltipComponent>;

    private over$ = new BehaviorSubject<number>(0);
    private subscription: Subscription;

    constructor(private elementRef: ElementRef<HTMLElement>,
                private popUpService: PopUpService,
                private viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {
        this.over$
            .pipe(debounceTime(100))
            .subscribe(value => value ? this.doComponentInit() : this.doComponentDestroy());
    }

    @HostListener('mouseover') mouseover() {
        this.over$.next(this.over$.value + 1);
    }

    @HostListener('mouseout') mouseout() {
        this.over$.next(this.over$.value - 1);
    }

    onComponentMouseOver(event: MouseEvent) {
        this.over$.next(this.over$.value + 1);
    }

    onComponentMouseOut(event: MouseEvent) {
        this.over$.next(this.over$.value - 1);
    }

    doComponentInit() {
        if (this.component) {
            return;
        }

        this.component = this.popUpService.createComponent(TooltipComponent);

        this.component.instance.text = this.tooltipText;
        this.component.instance.relativeHtmlElement = this.elementRef.nativeElement;

        this.subscription = new Subscription();
        this.subscription.add(this.component.instance.mouseover
            .subscribe((e: MouseEvent) => this.onComponentMouseOver(e)));
        this.subscription.add(this.component.instance.mouseout
            .subscribe((e: MouseEvent) => this.onComponentMouseOut(e)));

        this.viewContainerRef.insert(this.component.hostView);
    }

    doComponentDestroy() {
        if (this.component) {
            this.subscription.unsubscribe();
            this.subscription = null;
            this.component.destroy();
            this.component = null;
        }
    }

    ngOnDestroy(): void {
        this.over$.next(0);
        this.over$.complete();
    }

}
