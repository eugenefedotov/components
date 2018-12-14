import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {PopUpAlign, PopUpPosition} from '../../shared-directives/pop-up/pop-up.directive';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ControlErrorFormatterType} from '../../../../shared/models/control-error-formatter.type';
import {DEFAULT_CONTROL_ERROR_FORMATTERS} from '../../constants/default-control-error-formatters.const';

@Component({
    selector: 'app-control-error',
    templateUrl: './control-error.component.html',
    styleUrls: ['./control-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlErrorComponent implements ControlValueAccessor, OnInit, OnDestroy {
    PopUpPosition = PopUpPosition;
    PopUpAlign = PopUpAlign;

    ngControl: NgControl;

    errors: string[];

    @Input()
    formatters: { [errKey: string]: ControlErrorFormatterType };

    destroy$ = new Subject();

    constructor(private inj: Injector, private cdr: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        this.ngControl = this.inj.get(NgControl);

        this.ngControl.statusChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.updateErrors());

        this.updateErrors();
    }

    registerOnChange(fn: any): void {
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateErrors() {
        this.errors = [];
        const formatters = {...DEFAULT_CONTROL_ERROR_FORMATTERS, ...this.formatters};

        if (this.ngControl) {
            Object.keys(this.ngControl.errors)
                .map((key) => ({key, value: this.ngControl.errors[key], formatter: formatters[key]}))
                .forEach(({key, value, formatter}) => {
                    let error = `${key}:${value}`;

                    if (typeof formatter === 'function') {
                        error = formatter(value);
                    } else if (typeof formatter === 'string') {
                        error = formatter;
                    }

                    this.errors.push(error);
                });
        }

        this.cdr.markForCheck();
    }
}
