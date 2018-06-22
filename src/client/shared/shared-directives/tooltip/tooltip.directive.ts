import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {TooltipComponent} from '../../shared-components/tooltip/tooltip.component';
import {PopUpService} from '../../shared-services/pop-up/pop-up.service';

@Directive({
    selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {

    @Input('appTooltip') tooltipText: string;
    private component: ComponentRef<TooltipComponent>;

    constructor(private elementRef: ElementRef<HTMLElement>,
                private popUpService: PopUpService,
                private viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {
    }

    @HostListener('mouseover') mouseover() {
        this.component = this.popUpService.createComponent(TooltipComponent);

        this.component.instance.text = this.tooltipText;
        this.component.instance.relativeHtmlElement = this.elementRef.nativeElement;

        this.viewContainerRef.insert(this.component.hostView);
    }

    @HostListener('mouseout') mouseout() {
        if (this.component) {
            this.component.destroy();
            this.component = null;
        }
    }

    ngOnDestroy(): void {
        if (this.component) {
            this.component.destroy();
        }
    }

}
