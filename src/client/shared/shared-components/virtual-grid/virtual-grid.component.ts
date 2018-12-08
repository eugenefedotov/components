import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {GridSource} from '../../../../shared/classes/grid-source/grid-source';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arraySumIndex} from '../../../../functions/array-sum-index';
import {arraySum} from '../../../../functions/array-sum';
import {arrayEquals} from '../../../../functions/array-equals';
import {GridColumnModel} from '../../../../shared/classes/grid-source/models/grid-column.model';

@Component({
    selector: 'app-virtual-grid',
    templateUrl: './virtual-grid.component.html',
    styleUrls: ['./virtual-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualGridComponent<T extends Object = any> implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

    @Input()
    source: GridSource<T>;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    @Input()
    scrollBarHorizontalShow: boolean;
    @Input()
    scrollBarVerticalShow: boolean;

    @Input()
    scrollTop: number;
    @Input()
    scrollLeft: number;
    @Output()
    scrollTopChange = new EventEmitter<number>();
    @Output()
    scrollLeftChange = new EventEmitter<number>();

    source$ = new BehaviorSubject<GridSource<T>>(null);

    columns$ = this.source$
        .pipe(
            switchMap(source => source ? source.getColumns() : [[]]),
            distinctUntilChanged(arrayEquals),
            // tap(val => console.log('columns$', val))
        );

    widths$ = new BehaviorSubject<number[]>([]);
    heights$ = new BehaviorSubject<number[]>([]);

    scrollTop$ = new BehaviorSubject(0);
    scrollLeft$ = new BehaviorSubject(0);

    height$ = new BehaviorSubject(0);
    width$ = new BehaviorSubject(0);

    visibleRowStart$ = combineLatest(this.heights$, this.scrollTop$)
        .pipe(
            map(([heights, scrollTop]) => arraySumIndex(heights, scrollTop)),
            distinctUntilChanged()
        );
    visibleRowEnd$ = combineLatest(this.heights$, this.scrollTop$, this.height$)
        .pipe(
            map(([heights, scrollTop, height]) => arraySumIndex(heights, scrollTop + height, true)),
            distinctUntilChanged()
        );
    visibleColStart$ = combineLatest(this.widths$, this.scrollLeft$)
        .pipe(
            map(([widths, scrollLeft]) => arraySumIndex(widths, scrollLeft)),
            distinctUntilChanged()
        );
    visibleColEnd$ = combineLatest(this.widths$, this.scrollLeft$, this.width$)
        .pipe(
            map(([widths, scrollLeft, width]) => arraySumIndex(widths, scrollLeft + width, true)),
            distinctUntilChanged()
        );

    hiddenLeftPx$ = combineLatest(this.widths$, this.visibleColStart$)
        .pipe(
            map(([widths, offset]) => widths.slice(0, offset)),
            map(arraySum),
            distinctUntilChanged()
        );
    hiddenTopPx$ = combineLatest(this.heights$, this.visibleRowStart$)
        .pipe(
            // tap(([heights, offset]) => console.log({heights, offset})),
            map(([heights, offset]) => heights.slice(0, offset)),
            map(arraySum),
            // tap((sum) => console.log({sum})),
            distinctUntilChanged()
        );
    hiddenRightPx$ = combineLatest(this.widths$, this.visibleColEnd$)
        .pipe(
            map(([widths, offset]) => widths.slice(offset)),
            map(arraySum),
            distinctUntilChanged()
        );
    hiddenBottomPx$ = combineLatest(this.heights$, this.visibleRowEnd$)
        .pipe(
            map(([heights, offset]) => heights.slice(offset)),
            map(arraySum),
            distinctUntilChanged()
        );
    visibleColumns$ = combineLatest(this.columns$, this.visibleColStart$)
        .pipe(
            map(([columns, start]) => columns.slice(start)),
            distinctUntilChanged(arrayEquals),
            // tap(val => console.log('visibleColumns$', val))
        );
    visibleRows$ = combineLatest(this.source$, this.visibleColumns$, this.visibleRowStart$, this.visibleRowEnd$)
        .pipe(
            debounceTime(1),
            // tap(([source, columns, start, end]) => console.log({source, columns, start, end})),
            switchMap(([source, columns, start, end]) => source ? source.getData({
                offset: start,
                limit: end - start,
                fields: columns.map(column => column.field)
            }) : [null]),
            map(result => result ? result.items : []),
            distinctUntilChanged(arrayEquals),
            // tap(val => console.log('visibleRows$', val))
        );
    visibleWidths$ = combineLatest(this.widths$, this.visibleColStart$, this.visibleColEnd$)
        .pipe(
            map(([widths, offset, end]) => widths.slice(offset, end)),
            distinctUntilChanged(arrayEquals)
        );
    visibleHeights$ = combineLatest(this.heights$, this.visibleRowStart$, this.visibleRowEnd$)
        .pipe(
            map(([heights, offset, end]) => heights.slice(offset, end)),
            distinctUntilChanged(arrayEquals),
            // tap(val => console.log('visibleHeights$', val))
        );

    scrollBoxUpdate$ = new Subject();

    atomState: {
        rows: T[];
        columns: GridColumnModel<T>[];
        widths: number[];
        heights: number[];
        hiddenLeftPx: number;
        hiddenTopPx: number;
        hiddenRightPx: number;
        hiddenBottomPx: number;
    };

    destroy$ = new Subject();

    constructor(private elRef: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.scrollLeft$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(scrollLeft => {
                this.scrollLeft = scrollLeft;
                this.scrollLeftChange.emit(this.scrollLeft);
            });
        this.scrollTop$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(scrollTop => {
                this.scrollTop = scrollTop;
                this.scrollTopChange.emit(this.scrollTop);
            });

        combineLatest(
            this.visibleRows$,
            this.visibleColumns$,
            this.visibleWidths$,
            this.visibleHeights$,
            this.hiddenLeftPx$,
            this.hiddenTopPx$,
            this.hiddenRightPx$,
            this.hiddenBottomPx$
        )
            .pipe(
                // debounceTime(1),
                takeUntil(this.destroy$)
            )
            .subscribe(([rows, columns, widths, heights, hiddenLeftPx, hiddenTopPx, hiddenRightPx, hiddenBottomPx]) => {
                this.atomState = {
                    rows,
                    columns,
                    widths,
                    heights,
                    hiddenLeftPx,
                    hiddenTopPx,
                    hiddenRightPx,
                    hiddenBottomPx
                };
                // console.log(this.atomState);
                this.cdr.detectChanges();
                this.scrollBoxUpdate$.next();
            });
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
        if (hasAnyChanges<VirtualGridComponent>(changes, ['scrollTop'])) {
            this.scrollTop$.next(this.scrollTop);
        }
        if (hasAnyChanges<VirtualGridComponent>(changes, ['scrollLeft'])) {
            this.scrollLeft$.next(this.scrollLeft);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewChecked(): void {
        this.height$.next(this.elRef.nativeElement.offsetHeight);
        this.width$.next(this.elRef.nativeElement.offsetWidth);
    }
}
