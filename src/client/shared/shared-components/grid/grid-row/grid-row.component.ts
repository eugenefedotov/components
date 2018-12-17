import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {GridColumnModel} from '../../../classes/grid-source/models/grid-column.model';

@Component({
    selector: 'app-grid-row',
    templateUrl: './grid-row.component.html',
    styleUrls: ['./grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridRowComponent<T extends Object = any> implements OnInit {

    @Input()
    columns: GridColumnModel<T>[];

    @Input()
    row: T;

    @Input()
    widths: number[];

    @Input()
    height: number;

    constructor() {
    }

    ngOnInit() {
    }

}
