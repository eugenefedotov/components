import {Component, ElementRef, Input, OnInit, TemplateRef} from '@angular/core';
import {PopUpAlign, PopUpBound, PopUpPosition} from '../../../shared-directives/pop-up/pop-up.directive';


interface PopUpSize {
    x: number;
    y: number
}

@Component({
    selector: 'app-pop-up-container',
    template: '<ng-container *ngTemplateOutlet="templateRef"></ng-container>',
    styleUrls: ['./pop-up-container.component.scss']
})
export class PopUpContainerComponent implements OnInit {

    @Input() templateRef: TemplateRef<any>;

    @Input() popUpRelativeElementRef: ElementRef<HTMLElement>;

    @Input() popUpRelativePosition: PopUpPosition;
    @Input() popUpRelativeAlign: PopUpAlign;

    @Input() popUpContentPosition: PopUpPosition;
    @Input() popUpContentAlign: PopUpAlign;

    @Input() viewportBound: PopUpBound;

    private relativeBound: PopUpBound;
    private contentSize: PopUpSize;

    constructor() {
    }

    ngOnInit() {
    }

}
