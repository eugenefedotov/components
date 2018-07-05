import {Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SelectSource} from '../../../../shared/select-source/select-source';
import {SelectItemModel} from '../../../../shared/select-source/models/select-item.model';
import {Subject} from 'rxjs';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {PopUpAlign, PopUpPosition} from '../../shared-directives/pop-up/pop-up.directive';

const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
};

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [SELECT_VALUE_ACCESSOR]
})
export class SelectComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

    PopUpPosition = PopUpPosition;
    PopUpAlign = PopUpAlign;

    @Input() source: SelectSource;

    @Input() selectedItem: SelectItemModel;
    @Output() selectedItemChange = new EventEmitter<SelectItemModel>();

    value: any;

    destroy$ = new Subject();

    onChange: (value: any) => void;
    onTouched: () => void;

    drop = false;
    disabled = false;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['source'])) {
            this.updateItem();
        }
    }

    ngOnInit() {
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
        this.updateItem();
    }

    async updateItem() {
        if (!this.value || !this.source || this.selectedItem && this.selectedItem.value === this.value) {
            return;
        }

        this.selectedItem = await this.source.getByValue(this.value);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSelectClick($event: MouseEvent) {
        if (this.disabled) {
            return;
        }

        this.drop = !this.drop;

        if (this.onTouched) {
            this.onTouched();
        }
    }

    onItemClick($event: MouseEvent, item: SelectItemModel) {
        this.selectedItem = item;
        this.selectedItemChange.emit(this.selectedItem);

        if (this.onChange) {
            this.onChange(this.selectedItem.value);
        }
    }
}
