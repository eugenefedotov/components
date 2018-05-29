import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    @Input() isWarning = false;

    @Input() headerText: string;
    @Input() contentTemplate: TemplateRef<any>;

    @Input() rejectButtonText = 'Cancel';
    @Input() resolveButtonText = 'OK';


    @Output() reject = new EventEmitter();
    @Output() resolve = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    onCloseButtonClick($event: MouseEvent) {
        if (this.reject.observers.length) {
            this.reject.emit();
        } else {
            this.resolve.emit();
        }
    }

    onRejectButtonClick($event: MouseEvent) {
        this.reject.emit();
    }

    onResolveButtonClick($event: MouseEvent) {
        this.resolve.emit();
    }
}
