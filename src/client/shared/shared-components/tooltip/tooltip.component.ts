import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

    @Input() relativeHtmlElement: HTMLElement;
    @Input() text: string;

    @Output() mouseover = new EventEmitter<MouseEvent>();
    @Output() mouseout = new EventEmitter<MouseEvent>();

    constructor() {
    }

    ngOnInit() {
    }

}
