import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';

type ErrorFormatterFn = (errorValue: any) => string;

@Component({
    selector: 'app-input-wrapper',
    templateUrl: './input-wrapper.component.html',
    styleUrls: ['./input-wrapper.component.scss']
})
export class InputWrapperComponent implements OnInit {

    @Input() title: string;
    @Input() formControl: AbstractControl;
    @Input() errors: {[errorKey: string]: string | ErrorFormatterFn};

    constructor() {
    }

    ngOnInit() {
    }

    isViewError(): boolean {
        return !!(this.formControl && this.formControl.dirty && this.formControl.errors);
    }

    getError(): string {
        const controlErrors = Object
            .keys(this.formControl.errors)
            .map(errorKey => ({errorKey, errorValue: this.formControl.errors[errorKey]}))
            .filter(Boolean);

        const controlError = controlErrors[0];

        const errorValueOrFormatter = this.errors[controlError.errorKey];

        if (!errorValueOrFormatter) {
            return controlError.errorValue;
        }

        return typeof errorValueOrFormatter ==='function' ? errorValueOrFormatter(controlError.errorValue) : errorValueOrFormatter;
    }
}
