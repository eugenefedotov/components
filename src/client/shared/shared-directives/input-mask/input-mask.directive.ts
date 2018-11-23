import {Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MaskEntity} from '../../../../dao/mask/mask.entity';

@Directive({
    selector: 'input[appInputMask]'
})
export class InputMaskDirective implements OnChanges {

    @Input() appInputMask: MaskEntity;

    private el: HTMLInputElement;

    constructor(
        private elementRef: ElementRef<HTMLInputElement>
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    @HostListener('change')
    onValueChange() {
        this.formatValue();
    }

    @HostListener('blur')
    onBlur() {
        this.formatValue();
    }

    formatValue() {
        this.el.value = this.format(this.el.value);
    }

    format(text: string): string {
        return this.appInputMask ? this.appInputMask.format(text) : text;
    }
}
