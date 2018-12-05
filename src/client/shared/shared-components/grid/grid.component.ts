import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {GridColumnModel} from './models/grid-column.model';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {BehaviorSubject, Subject} from 'rxjs';
import {SlicedListSource} from '../../../../shared/classes/list-source/impl/sliced-list-source';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arraySum} from '../../../../functions/array-sum';
import {distinctUntilChanged, take, takeUntil} from 'rxjs/operators';
import {arrayEquals} from '../../../../functions/array-equals';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent<T extends Object = any> implements OnInit, OnChanges, OnDestroy {

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

    colsCount$ = new BehaviorSubject<number>(0);
    rowsCount$ = new BehaviorSubject<number>(0);

    widths$ = new BehaviorSubject<number[]>([]);
    heights$ = new BehaviorSubject<number[]>([]);

    leftHoldPx$ = new BehaviorSubject<number>(0);
    topHoldPx$ = new BehaviorSubject<number>(0);
    rightHoldPx$ = new BehaviorSubject<number>(0);
    bottomHoldPx$ = new BehaviorSubject<number>(0);

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

    destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.rowsCount$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.updateHeights();
            });

        this.colsCount$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.updateWidths();
            });

        this.heights$
            .pipe(
                distinctUntilChanged(arrayEquals),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.updateBottomHoldPx();
                this.updateBottomHeights();
                this.updateMiddleSource();
                this.updateBottomSource();
            });

        this.widths$
            .pipe(
                distinctUntilChanged(arrayEquals),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.updateRightHoldPx();
                this.updateRightWidths();
                this.updateCenterColumns();
                this.updateRightColumns();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const needUpdateWidths = hasAnyChanges<GridComponent>(changes, ['widths']);
        const needUpdateHeights = hasAnyChanges<GridComponent>(changes, ['heights']);

        const needLeftHoldPxUpdate = hasAnyChanges<GridComponent>(changes, ['defaultColWidth', 'widths', 'holdLeftCol']);
        const needRightHoldPxUpdate = hasAnyChanges<GridComponent>(changes, ['defaultColWidth', 'widths', 'holdRightCol']);
        const needTopHoldPxUpdate = hasAnyChanges<GridComponent>(changes, ['defaultRowHeight', 'heights', 'holdTopRow']);
        const needBottomHoldPxUpdate = hasAnyChanges<GridComponent>(changes, ['defaultRowHeight', 'heights', 'holdBottomRow']);

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

        const needColumnsCountUpdate = hasAnyChanges<GridComponent>(changes, ['columns']);
        const needRowsCountUpdate = hasAnyChanges<GridComponent>(changes, ['source']);

        if (needUpdateWidths) {
            this.updateWidths();
        }

        if (needUpdateHeights) {
            this.updateHeights();
        }

        if (needLeftHoldPxUpdate) {
            this.updateLeftHoldPx();
        }
        if (needTopHoldPxUpdate) {
            this.updateTopHoldPx();
        }
        if (needRightHoldPxUpdate) {
            this.updateRightHoldPx();
        }
        if (needBottomHoldPxUpdate) {
            this.updateBottomHoldPx();
        }

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

        if (needColumnsCountUpdate) {
            this.updateColsCount();
        }

        if (needRowsCountUpdate) {
            this.updateRowsCount();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateWidths() {
        const colsCount = this.colsCount$.value;
        const widths: number[] = [];
        for (let i = 0; i < colsCount; i++) {
            widths.push(this.widths[i] || this.defaultColWidth);
        }

        this.widths$.next(widths);
    }

    updateHeights() {
        const rowsCount = this.rowsCount$.value;
        const heights: number[] = [];
        for (let i = 0; i < rowsCount; i++) {
            heights.push(this.heights[i] || this.defaultRowHeight);
        }
        this.heights$.next(heights);
    }

    updateTopHoldPx() {
        this.topHoldPx$.next(arraySum(this.heights, 0, this.holdTopRow));
    }

    updateLeftHoldPx() {
        this.leftHoldPx$.next(arraySum(this.widths, 0, this.holdLeftCol));
    }

    updateRightHoldPx() {
        this.rightHoldPx$.next(arraySum(this.widths, this.colsCount$.value - this.holdRightCol, this.colsCount$.value - 1));
    }

    updateBottomHoldPx() {
        this.bottomHoldPx$.next(arraySum(this.heights, this.rowsCount$.value - this.holdBottomRow, this.rowsCount$.value - 1));
    }

    updateTopSource() {
        this.topSource$.next(new SlicedListSource(this.source, 0, this.holdTopRow));
    }

    updateMiddleSource() {
        this.middleSource$.next(new SlicedListSource(this.source, this.holdTopRow, this.rowsCount$.value - this.holdBottomRow));
    }

    updateBottomSource() {
        this.bottomSource$.next(new SlicedListSource(this.source, this.rowsCount$.value - this.holdBottomRow, this.rowsCount$.value - 1));
    }


    updateLeftColumns() {
        this.leftColumns$.next(this.columns.slice(0, this.holdLeftCol));
    }

    updateCenterColumns() {
        this.centerColumns$.next(this.columns.slice(this.holdLeftCol, this.colsCount$.value - this.holdRightCol));
    }

    updateRightColumns() {
        this.rightColumns$.next(this.columns.slice(this.colsCount$.value - this.holdRightCol, this.colsCount$.value - 1));
    }


    updateLeftWidths() {
        this.leftWidths$.next(this.widths.slice(0, this.holdLeftCol));
    }

    updateCenterWidths() {
        this.centerWidths$.next(this.widths.slice(this.holdLeftCol, this.colsCount$.value - this.holdRightCol));
    }

    updateRightWidths() {
        this.rightWidths$.next(this.widths.slice(this.colsCount$.value - this.holdRightCol, this.colsCount$.value - 1));
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

    updateColsCount() {
        this.colsCount$.next(this.columns ? this.columns.length : 0);
    }

    updateRowsCount() {
        this.rowsCount$.next(0);
        if (this.source) {
            this.source
                .getData({
                    offset: 0,
                    limit: 0
                })
                .pipe(
                    take(1),
                    takeUntil(this.destroy$)
                )
                .subscribe(result => {
                    this.rowsCount$.next(result.count);
                });
        }
    }
}
