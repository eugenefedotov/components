import {Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SelectSource} from '../../classes/select-source/select-source';
import {SelectItemModel} from '../../classes/select-source/models/select-item.model';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioComponent),
    multi: true
};

@Component({
    selector: 'app-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    providers: [RADIO_VALUE_ACCESSOR]
})
export class RadioComponent implements OnInit, OnChanges, ControlValueAccessor, OnDestroy {

    @Input() source: SelectSource;
    @Input() limit = 100;

    items: SelectItemModel[];
    value: string | number;

    changeFn: (value) => void;
    isDisabled: boolean;

    destroy$ = new Subject();

    constructor() {
    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<RadioComponent>(changes, ['source', 'limit'])) {
            this.updateItems();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }

    onValueChanged() {
        if (this.changeFn) {
            this.changeFn(this.value);
        }
    }

    private updateItems() {
        this.items = [];

        if (!this.source) {
            return;
        }

        this.source.getData({
            offset: 0,
            limit: this.limit
        })
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(result => this.items = result.items);
    }
}
