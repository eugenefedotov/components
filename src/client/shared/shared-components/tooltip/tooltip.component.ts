import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

    @Input() relativeHtmlElement: HTMLElement;
    @Input() text: string;

    constructor() {
    }

    ngOnInit() {
    }

}
