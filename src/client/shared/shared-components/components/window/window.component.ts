import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';

@Component({
    selector: 'app-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {

    @Input() headerText: string;
    @Input() contentTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;

    @Output() closeButtonClick = new EventEmitter<MouseEvent>();

    constructor() {
    }

    ngOnInit() {
    }

    onCloseButtonClick($event: MouseEvent) {
        this.closeButtonClick.emit($event);
    }

}
