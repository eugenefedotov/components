import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

    @Input()
    text: string;

    @Input()
    @HostBinding('class.accent')
    accent = false;

    @Input()
    disabled = false;

    @Output()
    click = new EventEmitter<MouseEvent>();

    @HostBinding('attr.disabled') get disabledAttr() {
        return this.disabled ? 'disabled' : null;
    }

    constructor() {
    }

    ngOnInit() {
    }

    onButtonClick($event: MouseEvent) {
        event.stopPropagation();
        this.click.emit($event);

        console.log('onButtonClick');
    }
}
