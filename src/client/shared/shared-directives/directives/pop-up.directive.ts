import {ComponentRef, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {PopUpService} from '../../shared-services/services/pop-up/pop-up.service';
import {PopUpContainerComponent} from '../../shared-components/components/base/pop-up-container/pop-up-container.component';

export enum PopUpPosition {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom'
}

export enum PopUpAligh {
    Start = 'start',
    Center = 'center',
    End = 'end'
}

@Directive({
    selector: '[appPopUp]'
})
export class PopUpDirective implements OnInit, OnChanges, OnDestroy {

    @Input('appPopUp') popUpRelative: ElementRef<HTMLElement>;
    @Input() popUpPosition: PopUpPosition;
    @Input() popUpAlign: PopUpAligh;

    private readonly container: ComponentRef<PopUpContainerComponent>;

    constructor(private el: ElementRef<HTMLElement>,
                private popUpService: PopUpService,
                private renderer: Renderer2) {
        this.container = this.popUpService.createComponent(PopUpContainerComponent);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const cont = this.container.instance;

        cont.popUpPosition = this.popUpPosition;
        cont.popUpAlign = this.popUpAlign;

        this.container.changeDetectorRef.detectChanges();
    }

    ngOnInit(): void {
        this.renderer.appendChild(this.container.location.nativeElement, this.el.nativeElement);
        this.popUpService.insertComponent(this.container);
    }

    ngOnDestroy(): void {
        this.container.destroy();
    }
}
