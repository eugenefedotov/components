import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [   // :enter is alias to 'void => *'
                style({opacity: 0}),
                animate('.5s ease-out', style({opacity: 1}))
            ]),
            transition(':leave', [   // :leave is alias to '* => void'
                animate('.2s ease-out', style({opacity: 0}))
            ])
        ])
    ]
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
