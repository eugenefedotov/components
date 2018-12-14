import {Component, forwardRef, HostBinding, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {MaskEntity} from '../../../../dao/mask/mask.entity';

const INPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
};

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [INPUT_VALUE_ACCESSOR]
})
export class InputComponent implements OnInit, ControlValueAccessor, OnDestroy {

    @Input()
    prefix: string;

    @Input()
    suffix: string;

    @Input()
    mask: MaskEntity;

    @Input()
    type: string;

    @Input()
    min: number;

    @Input()
    max: number;

    @Input()
    step: number;

    @HostBinding('class.focus')
    focus: boolean;
    value: any;

    destroy$ = new Subject();

    onChange: (value: any) => void;
    onTouched: () => void;
    disabled: boolean;

    ngControl: NgControl;

    constructor(private inj: Injector) {

    }

    ngOnInit(): void {
        this.ngControl = this.inj.get(NgControl);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }

    onValueChange() {
        if (this.onChange) {
            this.onChange(this.value);
        }

        if (this.onTouched) {
            this.onTouched();
        }
    }

    setFocus(focus: boolean) {
        this.focus = focus;

        if (!this.focus && this.onTouched) {
            this.onTouched();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
