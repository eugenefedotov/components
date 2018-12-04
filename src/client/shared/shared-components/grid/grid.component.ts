import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GridColumnModel} from './models/grid-column.model';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {BehaviorSubject} from 'rxjs';
import {SlicedListSource} from '../../../../shared/classes/list-source/impl/sliced-list-source';
import {hasAnyChanges} from '../../../../functions/has-any-changes';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent<T extends Object = any> implements OnInit, OnChanges {

    @Input()
    columns: GridColumnModel<T>[];

    @Input()
    source: ListSource<T>;

    @Input()
    defaultColWidth = 150;

    @Input()
    defaultRowHeight = 24;

    @Input()
    widths: number[] = [];

    @Input()
    heights: number[] = [];

    @Input()
    holdTopRow = 0;

    @Input()
    holdLeftCol = 0;

    @Input()
    holdRightCol = 0;

    @Input()
    holdBottomRow = 0;

    holdLeftPx$ = new BehaviorSubject<number>(0);
    holdTopPx$ = new BehaviorSubject<number>(0);
    holdRightPx$ = new BehaviorSubject<number>(0);
    holdBottomPx$ = new BehaviorSubject<number>(0);

    scrollTop$ = new BehaviorSubject<number>(0);
    scrollLeft$ = new BehaviorSubject<number>(0);

    topSource$ = new BehaviorSubject<ListSource<T>>(null);
    middleSource$ = new BehaviorSubject<ListSource<T>>(null);
    bottomSource$ = new BehaviorSubject<ListSource<T>>(null);

    topHeights$ = new BehaviorSubject<number[]>([]);
    middleHeights$ = new BehaviorSubject<number[]>([]);
    bottomHeights$ = new BehaviorSubject<number[]>([]);

    leftColumns$ = new BehaviorSubject<GridColumnModel<T>[]>([]);
    centerColumns$ = new BehaviorSubject<GridColumnModel<T>[]>([]);
    rightColumns$ = new BehaviorSubject<GridColumnModel<T>[]>([]);

    leftWidths$ = new BehaviorSubject<number[]>([]);
    centerWidths$ = new BehaviorSubject<number[]>([]);
    rightWidths$ = new BehaviorSubject<number[]>([]);

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const needLeftWidthsUpdate = hasAnyChanges<GridComponent>(changes, ['widths', 'holdLeftCol']);
        const needCenterWidthsUpdate = hasAnyChanges<GridComponent>(changes, ['widths', 'holdLeftCol', 'holdRightCol']);
        const needRightWidthsUpdate = hasAnyChanges<GridComponent>(changes, ['widths', 'holdRightCol']);

        const needTopHeightsUpdate = hasAnyChanges<GridComponent>(changes, ['heights', 'holdTopRow']);
        const needMiddleHeightsUpdate = hasAnyChanges<GridComponent>(changes, ['heights', 'holdTopRow', 'holdBottomRow']);
        const needBottomHeightsUpdate = hasAnyChanges<GridComponent>(changes, ['heights', 'holdBottomRow']);

        const needTopSourceUpdate = hasAnyChanges<GridComponent>(changes, ['source', 'holdTopRow']);
        const needMiddleSourceUpdate = hasAnyChanges<GridComponent>(changes, ['source', 'holdTopRow', 'holdBottomRow']);
        const needBottomSourceUpdate = hasAnyChanges<GridComponent>(changes, ['source', 'holdBottomRow']);

        const needLeftColumnsUpdate = hasAnyChanges<GridComponent>(changes, ['columns', 'holdLeftCol']);
        const needCenterColumnsUpdate = hasAnyChanges<GridComponent>(changes, ['columns', 'holdLeftCol', 'holdRightCol']);
        const needRightColumnsUpdate = hasAnyChanges<GridComponent>(changes, ['columns', 'holdRightCol']);

        if (needLeftWidthsUpdate) {
            this.updateLeftWidths();
        }
        if (needCenterWidthsUpdate) {
            this.updateCenterWidths();
        }
        if (needRightWidthsUpdate) {
            this.updateRightWidths();
        }

        if (needTopHeightsUpdate) {
            this.updateTopHeights();
        }
        if (needMiddleHeightsUpdate) {
            this.updateMiddleHeights();
        }
        if (needBottomHeightsUpdate) {
            this.updateBottomHeights();
        }

        if (needTopSourceUpdate) {
            this.updateTopSource();
        }
        if (needMiddleSourceUpdate) {
            this.updateMiddleSource();
        }
        if (needBottomSourceUpdate) {
            this.updateBottomSource();
        }

        if (needLeftColumnsUpdate) {
            this.updateLeftColumns();
        }
        if (needCenterColumnsUpdate) {
            this.updateCenterColumns();
        }
        if (needRightColumnsUpdate) {
            this.updateRightColumns();
        }
    }

    updateTopSource() {
        this.topSource$.next(this.holdTopRow ? new SlicedListSource(this.source, 0, this.holdTopRow) : null);
    }

    updateMiddleSource() {
        this.middleSource$.next(new SlicedListSource(this.source, this.holdTopRow, -this.holdBottomRow));
    }

    updateBottomSource() {
        this.bottomSource$.next(this.holdBottomRow ? new SlicedListSource(this.source, -this.holdBottomRow, 0) : null);
    }


    updateLeftColumns() {
        this.leftColumns$.next(this.holdLeftCol ? this.columns.slice(0, this.holdLeftCol) : null);
    }

    updateCenterColumns() {
        this.centerColumns$.next(this.columns);
    }

    updateRightColumns() {
        this.leftColumns$.next(this.holdRightCol ? this.columns.slice(-this.holdRightCol) : null);
    }


    updateLeftWidths() {
        this.leftWidths$.next(this.widths.slice(0, this.holdLeftCol));
    }

    updateCenterWidths() {
        this.centerWidths$.next(this.widths);
    }

    updateRightWidths() {
        this.leftWidths$.next(this.widths.slice(-this.holdRightCol));
    }


    updateTopHeights() {
        this.topHeights$.next(this.heights.slice(0, this.holdTopRow));
    }

    updateMiddleHeights() {
        this.middleHeights$.next(this.heights.slice(this.holdTopRow, -this.holdBottomRow));
    }

    updateBottomHeights() {
        this.bottomHeights$.next(this.heights.slice(-this.holdBottomRow, 0));
    }
}
