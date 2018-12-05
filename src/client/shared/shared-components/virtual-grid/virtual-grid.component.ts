import {AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GridSource} from '../../../../shared/classes/grid-source/grid-source';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arraySumIndex} from '../../../../functions/array-sum-index';
import {arraySum} from '../../../../functions/array-sum';

interface RowWithHeight<T> {
    row: T;
    height: number;
}

@Component({
    selector: 'app-virtual-grid',
    templateUrl: './virtual-grid.component.html',
    styleUrls: ['./virtual-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualGridComponent<T extends Object = any> implements OnInit, OnChanges, AfterViewChecked {

    @Input()
    source: GridSource<T>;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    source$ = new BehaviorSubject<GridSource<T>>(null);

    columns$ = this.source$
        .pipe(
            switchMap(source => source ? source.getColumns() : [[]]),
            // tap(val => console.log('columns$', val))
        );
    rowsCount$ = this.source$
        .pipe(
            switchMap(source => source ? source.getData({
                offset: 0,
                limit: 0
            }) : [null]),
            map(result => result ? result.count : 0)
        );

    widths$ = new BehaviorSubject<number[]>([]);
    heights$ = new BehaviorSubject<number[]>([]);

    scrollTop$ = new BehaviorSubject(0);
    scrollLeft$ = new BehaviorSubject(0);

    height$ = new BehaviorSubject(0);
    width$ = new BehaviorSubject(0);

    rowOffset$ = combineLatest(this.heights$, this.scrollTop$)
        .pipe(
            map(([heights, scrollTop]) => arraySumIndex(heights, scrollTop))
        );
    rowEnd$ = combineLatest(this.heights$, this.scrollTop$, this.height$)
        .pipe(
            map(([heights, scrollTop, height]) => arraySumIndex(heights, scrollTop + height))
        );
    colOffset$ = combineLatest(this.widths$, this.scrollLeft$)
        .pipe(
            map(([widths, scrollLeft]) => arraySumIndex(widths, scrollLeft))
        );
    colEnd$ = combineLatest(this.widths$, this.scrollLeft$, this.width$)
        .pipe(
            map(([widths, scrollLeft, width]) => arraySumIndex(widths, scrollLeft + width))
        );

    paddingLeft$ = combineLatest(this.widths$, this.colOffset$)
        .pipe(
            map(([widths, offset]) => widths.slice(0, offset)),
            map(arraySum)
        );
    paddingTop$ = combineLatest(this.heights$, this.rowOffset$)
        .pipe(
            map(([heights, offset]) => heights.slice(0, offset)),
            map(arraySum)
        );
    paddingRight$ = combineLatest(this.widths$, this.colEnd$, this.columns$)
        .pipe(
            map(([widths, viewEnd, columns]) => widths.slice(viewEnd, columns.length)),
            map(arraySum)
        );
    paddingBottom$ = combineLatest(this.heights$, this.rowEnd$, this.rowsCount$)
        .pipe(
            map(([heights, offset, end]) => heights.slice(offset, end)),
            map(arraySum)
        );
    visibleColumns$ = combineLatest(this.columns$, this.colOffset$, this.colEnd$)
        .pipe(
            map(([columns, start, end]) => columns.slice(start, end)),
            // tap(val => console.log('visibleColumns$', val))
        );
    visibleRows$ = combineLatest(this.source$, this.visibleColumns$, this.rowOffset$, this.rowEnd$)
        .pipe(
            // tap(val => console.log('visibleRows$ input', val)),
            switchMap(([source, columns, start, end]) => source ? source.getData({
                offset: start,
                limit: end - start,
                fields: columns.map(column => column.field)
            }) : [null]),
            map(result => result ? result.items : []),
            // tap(val => console.log('visibleRows$', val))
        );
    visibleWidths$ = combineLatest(this.widths$, this.colOffset$, this.colEnd$)
        .pipe(
            map(([widths, offset, end]) => widths.slice(offset, end))
        );
    visibleHeights$ = combineLatest(this.heights$, this.rowOffset$, this.rowEnd$)
        .pipe(
            map(([heights, offset, end]) => heights.slice(offset, end)),
            // tap(val => console.log('visibleHeights$', val))
        );

    visibleRowsWithHeights$: Observable<RowWithHeight<T>[]> = combineLatest(this.visibleHeights$, this.visibleRows$)
        .pipe(
            map(([heights, rows]) => heights.map((height, index) => ({
                row: rows[index],
                height: height
            }))),
            // tap(val => console.log('visibleRowsWithHeights$', val))
        );

    constructor(private elRef: ElementRef<HTMLElement>) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<VirtualGridComponent>(changes, ['source'])) {
            this.source$.next(this.source);
        }
        if (hasAnyChanges<VirtualGridComponent>(changes, ['widths'])) {
            this.widths$.next(this.widths);
        }
        if (hasAnyChanges<VirtualGridComponent>(changes, ['heights'])) {
            this.heights$.next(this.heights);
        }
    }

    ngAfterViewChecked(): void {
        this.height$.next(this.elRef.nativeElement.offsetHeight);
        this.width$.next(this.elRef.nativeElement.offsetWidth);
    }
}
