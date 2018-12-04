import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
    defaultColWidth = 150;

    @Input()
    defaultRowHeight = 24;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    @Input()
    scrollLeft: number;

    @Output()
    scrollLeftChange = new EventEmitter<number>();

    @Input()
    scrollTop: number;

    @Output()
    scrollTopChange = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

}
