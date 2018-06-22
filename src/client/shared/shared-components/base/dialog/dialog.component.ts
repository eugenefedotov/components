import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {WindowStyleEnum} from '../window/models/window-style.enum';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnDestroy {

    @Input() windowStyle = WindowStyleEnum.Neutral;

    @Input() headerText: string;
    @Input() contentText: string;

    @Input() rejectButtonText = 'Cancel';
    @Input() resolveButtonText = 'OK';

    @Output() rejected = new EventEmitter<void>();
    @Output() resolved = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    constructor() {
    }

    close() {
        if (this.rejected.observers.length) {
            this.rejected.emit();
        } else {
            this.resolved.emit();
        }
        this.closed.emit();
    }

    onCloseClick($event: MouseEvent) {
        this.close();
    }

    onRejectButtonClick($event: MouseEvent) {
        this.rejected.emit();
        this.closed.emit();
    }

    onResolveButtonClick($event: MouseEvent) {
        this.resolved.emit();
        this.closed.emit();
    }

    ngOnDestroy() {
        this.close();
    }
}
