import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {GridColumnModel} from '../models/grid-column.model';
import {ListSource} from '../../../../../shared/classes/list-source/list-source';

@Component({
    selector: 'app-grid-viewport',
    templateUrl: './grid-viewport.component.html',
    styleUrls: ['./grid-viewport.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridViewportComponent<T extends Object = any> implements OnInit {

    @Input()
    columns: GridColumnModel<T>[];

    @Input()
    source: ListSource<T>;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    @Input()
    left: number;

    @Input()
    top: number;

    constructor() {
    }

    ngOnInit() {
    }

}
