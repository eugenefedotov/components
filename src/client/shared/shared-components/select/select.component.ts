import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SelectSource} from '../../../../shared/classes/select-source/select-source';
import {SelectItemModel} from '../../../../shared/classes/select-source/models/select-item.model';
import {BehaviorSubject, combineLatest, merge, of, Subject} from 'rxjs';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {PopUpAlign, PopUpPosition} from '../../shared-directives/pop-up/pop-up.directive';
import {KeyComparator} from '../../../../shared/classes/comparator/impl/key-comparator';
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import {PersistentFilterSelectSource} from '../../../../shared/classes/select-source/impl/persistent-filter-select-source';

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
    @Input() canClear = true;

    @Input() selectedItem: SelectItemModel;
    @Output() selectedItemChange = new EventEmitter<SelectItemModel>();

    source$ = new BehaviorSubject<SelectSource>(null);
    filterControl = new FormControl('');
    filteredSource$ = new BehaviorSubject<SelectSource>(null);

    value: any;

    destroy$ = new Subject();

    onChange: (value: any) => void;
    onTouched: () => void;

    drop = false;
    disabled = false;

    @ViewChild('selectDrop') selectDrop: ElementRef<HTMLElement>;

    comparator = new KeyComparator('value');

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['source'])) {
            this.source$.next(this.source);
        }
    }

    ngOnInit() {
        combineLatest(
            this.source$,
            merge(of(this.filterControl.value), this.filterControl.valueChanges)
                .pipe(
                    debounceTime(500)
                )
        )
            .pipe(
                takeUntil(this.destroy$),
                map(([source, filter]) => filter ? new PersistentFilterSelectSource(source, filter) : source)
            )
            .subscribe(filteredSource => this.filteredSource$.next(filteredSource));
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

        this.source.getByValue(this.value)
            .subscribe(result => this.selectedItem = result);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSelectClick($event: MouseEvent) {
        if (this.disabled) {
            return;
        }

        if (!this.source) {
            console.error(`no source`);
            return;
        }


        this.drop ? this.closeDrop() : this.openDrop();
    }

    setItem(item: SelectItemModel) {
        this.selectedItem = item;
        this.selectedItemChange.emit(this.selectedItem);

        if (this.onChange) {
            this.onChange(this.selectedItem.value);
        }
    }

    onItemClick($event: MouseEvent, item: SelectItemModel) {
        this.setItem(item);

        this.closeDrop();
    }

    @HostListener('document:mousedown', ['$event'])
    onDocumentClick($event: MouseEvent) {
        if (!this.drop) {
            return;
        }

        if (!this.selectDrop.nativeElement.contains($event.target as Node)) {
            this.closeDrop();
        }
    }

    openDrop() {
        this.drop = true;

        if (this.onTouched) {
            this.onTouched();
        }
    }

    closeDrop() {
        this.drop = false;
    }

    onClearClick($event) {
        this.setItem(null);
    }
}
