import {
    ComponentRef,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import {PopUpService} from '../../shared-services/pop-up/pop-up.service';
import {PopUpContainerComponent} from '../../shared-components/pop-up-container/pop-up-container.component';
import {ComponentFactoryService} from '../../shared-services/component-factory/component-factory.service';

export interface PopUpBound {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export enum PopUpPosition {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom'
}

export enum PopUpAlign {
    Start = 'start',
    Center = 'center',
    End = 'end'
}

@Directive({
    selector: '[appPopUp]'
})
export class PopUpDirective implements OnInit, OnChanges, OnDestroy {

    @Input('appPopUp') popUpRelativeHtmlElement: HTMLElement;

    @Input() viewportBound: PopUpBound;

    @Input() popUpContentPosition: PopUpPosition = PopUpPosition.Top;
    @Input() popUpContentAlign: PopUpAlign = PopUpAlign.Center;

    private readonly container: ComponentRef<PopUpContainerComponent>;

    constructor(private templateRef: TemplateRef<any>,
                private viewContainer: ViewContainerRef,
                private componentFactoryService: ComponentFactoryService,
                private popUpService: PopUpService) {
        this.container = this.componentFactoryService.createComponent(PopUpContainerComponent);

        console.log('appPopUp create');
    }

    ngOnChanges(changes: SimpleChanges): void {
        const cont = this.container.instance;

        cont.templateRef = this.templateRef;
        cont.viewportBound = this.viewportBound;

        cont.popUpRelativeHtmlElement = this.popUpRelativeHtmlElement;

        cont.popUpContentPosition = this.popUpContentPosition;
        cont.popUpContentAlign = this.popUpContentAlign;

        this.container.changeDetectorRef.detectChanges();
    }

    ngOnInit(): void {
        if (!(this.popUpRelativeHtmlElement instanceof HTMLElement)) {
            console.error('required popUpRelativeHtmlElement instanceof HTMLElement');
            return;
        }

        console.log('popUpRelativeHtmlElement', this.popUpRelativeHtmlElement);

        this.viewContainer.clear();
        this.popUpService.insertComponent(this.container);
    }

    ngOnDestroy(): void {
        this.container.destroy();
        console.log('appPopUp destroy');
    }
}
