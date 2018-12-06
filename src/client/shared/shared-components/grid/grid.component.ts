import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arraySum} from '../../../../functions/array-sum';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {arrayFillSpaces} from '../../../../functions/array-fill-spaces';
import {GridSource} from '../../../../shared/classes/grid-source/grid-source';
import {SlicedDataSource} from '../../../../shared/classes/data-source/impl/sliced-data-source';
import {arrayEquals} from '../../../../functions/array-equals';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent<T extends Object = any> implements OnInit, OnChanges {

    @Input()
    source: GridSource<T>;

    @Input()
    defaultColWidth: number;

    @Input()
    defaultRowHeight: number;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    @Input()
    holdTopRow = 0;

    @Input()
    holdLeftCol = 0;

    @Input()
    holdRightCol = 0;

    @Input()
    holdBottomRow = 0;

    source$ = new BehaviorSubject<GridSource<T>>(null);
    columns$ = this.source$
        .pipe(
            switchMap(source => source.getColumns()),
            distinctUntilChanged(arrayEquals)
        );

    defaultRowHeight$ = new BehaviorSubject<number>(24);
    defaultColWidth$ = new BehaviorSubject<number>(150);

    holdTopRow$ = new BehaviorSubject<number>(0);
    holdLeftCol$ = new BehaviorSubject<number>(0);
    holdRightCol$ = new BehaviorSubject<number>(0);
    holdBottomRow$ = new BehaviorSubject<number>(0);

    rowsCount$ = this.source$
        .pipe(
            switchMap(src => src.getData({
                offset: 0,
                limit: 0
            })),
            map(result => result.count),
            distinctUntilChanged()
        );

    widths$ = new BehaviorSubject<number[]>([]);
    heights$ = new BehaviorSubject<number[]>([]);

    filledWidths$ = combineLatest(this.widths$, this.defaultColWidth$, this.columns$)
        .pipe(
            map(([widths, dcw, columns]) => arrayFillSpaces(widths, dcw, columns.length)),
            distinctUntilChanged(arrayEquals)
        );
    filledHeights$ = combineLatest(this.heights$, this.defaultRowHeight$, this.rowsCount$)
        .pipe(
            map(([heights, drh, rowsCount]) => arrayFillSpaces(heights, drh, rowsCount)),
            distinctUntilChanged(arrayEquals)
        );

    scrollTop$ = new BehaviorSubject<number>(0);
    scrollLeft$ = new BehaviorSubject<number>(0);

    sourceTop$ = combineLatest(this.source$, this.holdTopRow$)
        .pipe(
            map(([source, holdTopRow]) =>
                new SlicedDataSource(source, 0, holdTopRow))
        );
    sourceMiddle$ = combineLatest(this.source$, this.holdTopRow$, this.holdBottomRow$, this.rowsCount$)
        .pipe(
            map(([source, holdTopRow, holdBottomRow, rowsCount]) =>
                new SlicedDataSource(source, holdTopRow, rowsCount - holdBottomRow))
        );
    sourceBottom$ = combineLatest(this.source$, this.holdBottomRow$, this.rowsCount$)
        .pipe(
            map(([source, holdBottomRow, rowsCount]) =>
                new SlicedDataSource(source, holdBottomRow, rowsCount))
        );

    heightsTop$ = combineLatest(this.holdTopRow$, this.filledHeights$)
        .pipe(
            map(([holdTopRow, heights]) => heights.slice(0, holdTopRow)),
            distinctUntilChanged(arrayEquals)
        );
    heightsMiddle$ = combineLatest(this.holdTopRow$, this.holdBottomRow$, this.filledHeights$, this.rowsCount$)
        .pipe(
            map(([holdTopRow, holdBottomRow, heights, rowsCount]) => heights.slice(holdTopRow, rowsCount - holdBottomRow)),
            distinctUntilChanged(arrayEquals)
        );
    heightsBottom$ = combineLatest(this.holdBottomRow$, this.filledHeights$, this.rowsCount$)
        .pipe(
            map(([holdBottomRow, heights, rowsCount]) => heights.slice(rowsCount - holdBottomRow, rowsCount)),
            distinctUntilChanged(arrayEquals)
        );

    columnsLeft$ = combineLatest(this.columns$, this.holdLeftCol$)
        .pipe(
            map(([columns, holdLeftCol]) => columns.slice(0, holdLeftCol)),
            distinctUntilChanged(arrayEquals)
        );
    columnsCenter$ = combineLatest(this.columns$, this.holdLeftCol$, this.holdRightCol$)
        .pipe(
            map(([columns, holdLeftCol, holdRightCol]) => columns.slice(holdLeftCol, columns.length - holdRightCol)),
            distinctUntilChanged(arrayEquals)
        );
    columnsRight$ = combineLatest(this.columns$, this.holdRightCol$)
        .pipe(
            map(([columns, holdRightCol]) => columns.slice(columns.length - holdRightCol)),
            distinctUntilChanged(arrayEquals)
        );

    widthsLeft$ = combineLatest(this.filledWidths$, this.holdLeftCol$)
        .pipe(
            map(([widths, holdLeftCol]) => widths.slice(0, holdLeftCol)),
            distinctUntilChanged(arrayEquals)
        );
    widthsCenter$ = combineLatest(this.filledWidths$, this.holdLeftCol$, this.holdRightCol$)
        .pipe(
            map(([widths, holdLeftCol, holdRightCol]) => widths.slice(holdLeftCol, widths.length - holdRightCol)),
            distinctUntilChanged(arrayEquals)
        );
    widthsRight$ = combineLatest(this.filledWidths$, this.holdRightCol$)
        .pipe(
            map(([widths, holdRightCol]) => widths.slice(widths.length - holdRightCol)),
            distinctUntilChanged(arrayEquals)
        );

    holdLeftPx$ = this.widthsLeft$
        .pipe(
            map(arraySum),
            distinctUntilChanged()
        );
    holdTopPx$ = this.heightsTop$
        .pipe(
            map(arraySum),
            distinctUntilChanged()
        );
    holdRightPx$ = this.widthsRight$
        .pipe(
            map(arraySum),
            distinctUntilChanged()
        );
    holdBottomPx$ = this.heightsBottom$
        .pipe(
            map(arraySum),
            distinctUntilChanged()
        );

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<GridComponent>(changes, ['holdTopRow'])) {
            this.holdTopRow$.next(this.holdTopRow);
        }
        if (hasAnyChanges<GridComponent>(changes, ['holdBottomRow'])) {
            this.holdBottomRow$.next(this.holdBottomRow);
        }
        if (hasAnyChanges<GridComponent>(changes, ['holdLeftCol'])) {
            this.holdLeftCol$.next(this.holdLeftCol);
        }
        if (hasAnyChanges<GridComponent>(changes, ['holdRightCol'])) {
            this.holdRightCol$.next(this.holdRightCol);
        }

        if (hasAnyChanges<GridComponent>(changes, ['defaultColWidth'])) {
            this.defaultColWidth$.next(this.defaultColWidth);
        }
        if (hasAnyChanges<GridComponent>(changes, ['defaultRowHeight'])) {
            this.defaultRowHeight$.next(this.defaultRowHeight);
        }

        if (hasAnyChanges<GridComponent>(changes, ['widths'])) {
            this.widths$.next(this.widths);
        }
        if (hasAnyChanges<GridComponent>(changes, ['heights'])) {
            this.heights$.next(this.heights);
        }
        if (hasAnyChanges<GridComponent>(changes, ['source'])) {
            this.source$.next(this.source);
        }
    }
}
