import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';
import {WindowStyleEnum} from '../window/models/window-style.enum';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {

    @Input() windowStyle = WindowStyleEnum.Neutral;

    @Input() headerText: string;
    @Input() contentText: string;

    @Input() rejectButtonText = 'Cancel';
    @Input() resolveButtonText = 'OK';

    @Output() reject = new EventEmitter<void>();
    @Output() resolve = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit() {
    }

    close() {
        if (this.reject.observers.length) {
            this.reject.emit();
        } else {
            this.resolve.emit();
        }
        this.closed.emit();
    }

    onCloseButtonClick($event: MouseEvent) {
        this.close();
    }

    onRejectButtonClick($event: MouseEvent) {
        this.reject.emit();
    }

    onResolveButtonClick($event: MouseEvent) {
        this.resolve.emit();
    }

    ngOnDestroy() {
        this.close();
    }
}
