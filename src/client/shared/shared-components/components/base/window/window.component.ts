import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {WindowStyleEnum} from './models/window-style.enum';

@Component({
    selector: 'app-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {

    @Input() windowStyle = WindowStyleEnum.Neutral;

    @Input() headerText: string;
    @Input() contentTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;

    @Output() closeClick = new EventEmitter<MouseEvent>();

    constructor() {
    }

    ngOnInit() {
    }

    onCloseButtonClick($event: MouseEvent) {
        this.closeClick.emit($event);
    }

}
