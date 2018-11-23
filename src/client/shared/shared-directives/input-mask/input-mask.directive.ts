import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MaskEntity} from '../../../../dao/mask/mask.entity';

/**
 * todo
 */

@Directive({
    selector: 'input[appInputMask]'
})
export class InputMaskDirective implements OnChanges {

    @Input() appInputMask: MaskEntity;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {

    }
}
