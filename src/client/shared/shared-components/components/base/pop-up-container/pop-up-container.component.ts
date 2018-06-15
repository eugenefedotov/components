import {Component, Input, OnInit} from '@angular/core';
import {PopUpAligh, PopUpPosition} from '../../../../shared-directives/directives/pop-up.directive';

@Component({
    selector: 'app-pop-up-container',
    template: '',
    styleUrls: ['./pop-up-container.component.scss']
})
export class PopUpContainerComponent implements OnInit {

    @Input() popUpPosition: PopUpPosition;
    @Input() popUpAlign: PopUpAligh;

    constructor() {
    }

    ngOnInit() {
    }

}
