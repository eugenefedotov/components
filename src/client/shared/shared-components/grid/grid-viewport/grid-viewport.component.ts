import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GridColumnModel} from '../../../../../shared/classes/grid-source/models/grid-column.model';
import {DataSource} from '../../../../../shared/classes/data-source/data-source';

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
    source: DataSource<T>;

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
