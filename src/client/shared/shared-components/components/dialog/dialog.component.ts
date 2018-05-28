import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    @Input() headerText: string;

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
