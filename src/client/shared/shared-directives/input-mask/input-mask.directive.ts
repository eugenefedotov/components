import {Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MaskEntity, MaskResult} from '../../../../dao/mask/mask.entity';
import {AbstractControl, NgControl, ValidationErrors} from '@angular/forms';
import {Subject} from 'rxjs';
import {distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';

@Directive({
    selector: 'input[appInputMask]'
})
export class InputMaskDirective implements OnChanges, OnInit, OnDestroy {

    @Input() appInputMask: MaskEntity;

    private el: HTMLInputElement;
    private destroy$ = new Subject();
    private oldValue: string;

    constructor(
        private elementRef: ElementRef<HTMLInputElement>,
        private control: NgControl
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit(): void {
        this.control.control.valueChanges
            .pipe(
                filter(() => !!this.appInputMask),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.updateInput());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('appInputMask')) {
            this.updateInput(true);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @HostListener('focus')
    onFocus() {
        this.updateInput();
    }

    updateInput(init = false) {
        const origin = String(this.control.control.value);

        if (this.oldValue === origin && !init) {
            return;
        }

        const isAdding = String(this.oldValue).length <= origin.length;
        const maskResult = this.tryMask(origin, isAdding);
        this.oldValue = origin;

        if (maskResult) {
            if (origin !== maskResult.formatted) {
                this.control.control.setValue(maskResult.formatted);
            }

            if (maskResult.cursor !== null) {
                // console.log(maskResult);
                this.el.selectionStart = maskResult.cursor;
                this.el.selectionEnd = maskResult.cursor;
            }
        }
    }

    private tryMask(text: string, adding: boolean): MaskResult {
        return this.appInputMask ? this.appInputMask.try(text, adding) : null;
    }
}
