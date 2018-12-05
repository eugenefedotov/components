import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GridColumnModel} from './models/grid-column.model';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {SlicedListSource} from '../../../../shared/classes/list-source/impl/sliced-list-source';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arraySum} from '../../../../functions/array-sum';
import {map, switchMap, tap} from 'rxjs/operators';
import {arrayFillSpaces} from '../../../../functions/array-fill-spaces';

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

    columns$ = new BehaviorSubject<GridColumnModel<T>[]>([]);
    source$ = new BehaviorSubject<ListSource<T>>(null);

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
            map(result => result.count)
        );

    widths$ = new BehaviorSubject<number[]>([]);
    heights$ = new BehaviorSubject<number[]>([]);

    filledWidths$ = combineLatest(this.widths$, this.defaultColWidth$, this.columns$)
        .pipe(
            map(([widths, dcw, columns]) => arrayFillSpaces(widths, dcw, columns.length))
        );
    filledHeights$ = combineLatest(this.heights$, this.defaultRowHeight$, this.rowsCount$)
        .pipe(
            map(([heights, drh, rowsCount]) => arrayFillSpaces(heights, drh, rowsCount))
        );

    scrollTop$ = new BehaviorSubject<number>(0);
    scrollLeft$ = new BehaviorSubject<number>(0);

    sourceTop$ = combineLatest(this.source$, this.holdTopRow$)
        .pipe(
            map(([source, holdTopRow]) => new SlicedListSource(source, 0, holdTopRow))
        );
    sourceMiddle$ = combineLatest(this.source$, this.holdTopRow$, this.holdBottomRow$, this.rowsCount$)
        .pipe(
            map(([source, holdTopRow, holdBottomRow, rowsCount]) =>
                new SlicedListSource(source, holdTopRow, rowsCount - holdBottomRow))
        );
    sourceBottom$ = combineLatest(this.source$, this.holdBottomRow$, this.rowsCount$)
        .pipe(
            map(([source, holdBottomRow, rowsCount]) =>
                new SlicedListSource(source, holdBottomRow, rowsCount))
        );

    heightsTop$ = combineLatest(this.holdTopRow$, this.filledHeights$)
        .pipe(
            map(([holdTopRow, heights]) => heights.slice(0, holdTopRow))
        );
    heightsMiddle$ = combineLatest(this.holdTopRow$, this.holdBottomRow$, this.filledHeights$, this.rowsCount$)
        .pipe(
            map(([holdTopRow, holdBottomRow, heights, rowsCount]) => heights.slice(holdTopRow, rowsCount - holdBottomRow))
        );
    heightsBottom$ = combineLatest(this.holdBottomRow$, this.filledHeights$, this.rowsCount$)
        .pipe(
            map(([holdBottomRow, heights, rowsCount]) => heights.slice(rowsCount - holdBottomRow, rowsCount))
        );

    columnsLeft$ = combineLatest(this.columns$, this.holdLeftCol$)
        .pipe(
            map(([columns, holdLeftCol]) => columns.slice(0, holdLeftCol))
        );
    columnsCenter$ = combineLatest(this.columns$, this.holdLeftCol$, this.holdRightCol$)
        .pipe(
            map(([columns, holdLeftCol, holdRightCol]) => columns.slice(holdLeftCol, columns.length - holdRightCol))
        );
    columnsRight$ = combineLatest(this.columns$, this.holdRightCol$)
        .pipe(
            map(([columns, holdRightCol]) => columns.slice(columns.length - holdRightCol))
        );

    widthsLeft$ = combineLatest(this.filledWidths$, this.holdLeftCol$)
        .pipe(
            map(([widths, holdLeftCol]) => widths.slice(0, holdLeftCol))
        );
    widthsCenter$ = combineLatest(this.filledWidths$, this.holdLeftCol$, this.holdRightCol$)
        .pipe(
            map(([widths, holdLeftCol, holdRightCol]) => widths.slice(holdLeftCol, widths.length - holdRightCol))
        );
    widthsRight$ = combineLatest(this.filledWidths$, this.holdRightCol$)
        .pipe(
            map(([widths, holdRightCol]) => widths.slice(widths.length - holdRightCol))
        );

    holdLeftPx$ = this.widthsLeft$
        .pipe(
            map(arraySum)
        );
    holdTopPx$ = this.heightsTop$
        .pipe(
            map(arraySum)
        );
    holdRightPx$ = this.widthsRight$
        .pipe(
            map(arraySum)
        );
    holdBottomPx$ = this.heightsBottom$
        .pipe(
            map(arraySum)
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
        if (hasAnyChanges<GridComponent>(changes, ['columns'])) {
            this.columns$.next(this.columns);
        }
        if (hasAnyChanges<GridComponent>(changes, ['source'])) {
            this.source$.next(this.source);
        }
    }
}
