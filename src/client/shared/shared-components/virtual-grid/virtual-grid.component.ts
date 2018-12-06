import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {GridSource} from '../../../../shared/classes/grid-source/grid-source';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {distinctUntilChanged, map, switchMap, takeUntil} from 'rxjs/operators';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arraySumIndex} from '../../../../functions/array-sum-index';
import {arraySum} from '../../../../functions/array-sum';
import {arrayEquals} from '../../../../functions/array-equals';
import {GridColumnModel} from '../../../../shared/classes/grid-source/models/grid-column.model';
import {ScrollBoxComponent} from '../scroll-box/scroll-box.component';

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

    @ViewChild(ScrollBoxComponent)
    scrollBox: ScrollBoxComponent;

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
            map(([heights, scrollTop, height]) => arraySumIndex(heights, scrollTop + height)),
            distinctUntilChanged()
        );
    visibleColStart$ = combineLatest(this.widths$, this.scrollLeft$)
        .pipe(
            map(([widths, scrollLeft]) => arraySumIndex(widths, scrollLeft)),
            distinctUntilChanged()
        );
    visibleColEnd$ = combineLatest(this.widths$, this.scrollLeft$, this.width$)
        .pipe(
            map(([widths, scrollLeft, width]) => arraySumIndex(widths, scrollLeft + width)),
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
            map(([heights, offset]) => heights.slice(0, offset)),
            map(arraySum),
            distinctUntilChanged()
        );
    hiddenRightPx$ = combineLatest(this.widths$, this.visibleColEnd$, this.columns$)
        .pipe(
            map(([widths, viewEnd, columns]) => widths.slice(viewEnd, columns.length)),
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
            // tap(val => console.log('visibleRows$ input', val)),
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
                this.cdr.detectChanges();
                this.scrollBox.needUpdate$.next();
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
