import {ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
/* tslint:disable */
@Component({
    selector: 'button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit {

    @Input() text: string;
    @Input()
    @HostBinding('class.accent')
    accent = false;

    constructor(private elementRef: ElementRef<HTMLInputElement>) {
    }

    ngOnInit() {
    }
}
