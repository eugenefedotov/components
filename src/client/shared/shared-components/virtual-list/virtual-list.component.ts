import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChildren
} from '@angular/core';
import {debounceTime, distinctUntilChanged, map, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {CachedListSource} from '../../../../shared/classes/list-source/impl/cached-list-source/cached-list-source';
import {arraySum} from '../../../../functions/array-sum';
import {sourceSizeSwitchMap} from '../../../../functions/source-size-switch-map';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {arrayFillSpaces} from '../../../../functions/array-fill-spaces';
import {arraySumIndex} from '../../../../functions/array-sum-index';
import {arrayEquals} from '../../../../functions/array-equals';

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent<T = any> implements OnInit, OnChanges, OnInit, AfterContentChecked, OnDestroy {

    @Input() source: ListSource<T>;
    @Input() itemPlaceholderTemplate: TemplateRef<any>;
    @Input() itemTemplate: TemplateRef<any>;
    @Input() minItemHeight = 32;

    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef>;

    minItemHeight$ = new BehaviorSubject<number>(32);
    realItemHeights$ = new BehaviorSubject<number[]>([]);

    visibleHeight$ = new Subject<number>();
    scrollTop$ = new BehaviorSubject<number>(0);
    source$ = new BehaviorSubject<CachedListSource<T>>(null);
    sourceSize$ = this.source$
        .pipe(
            switchMap(source => source ? sourceSizeSwitchMap(source) : [0])
        );
    heights$: Observable<number[]> = combineLatest(
        this.realItemHeights$.pipe(distinctUntilChanged(arrayEquals)),
        this.minItemHeight$,
        this.sourceSize$
    )
        .pipe(
            distinctUntilChanged(arrayEquals),
            map(([realItemHeights, minItemHeight, sourceSize]) => arrayFillSpaces(realItemHeights, minItemHeight, sourceSize)),
            distinctUntilChanged(arrayEquals)
        );

    visibleOffset$: Observable<number> = combineLatest(this.heights$, this.scrollTop$)
        .pipe(
            map(([heights, scrollTop]) => arraySumIndex(heights, scrollTop)),
            distinctUntilChanged()
        );
    visibleEnd$: Observable<number> = combineLatest(this.heights$, this.scrollTop$, this.visibleHeight$)
        .pipe(
            map(([heights, scrollTop, height]) => arraySumIndex(heights, scrollTop + height, true)),
            distinctUntilChanged()
        );

    heightsTop$: Observable<number[]> = combineLatest(this.heights$, this.visibleOffset$)
        .pipe(
            map(([heights, offset]) => heights.slice(0, offset)),
            distinctUntilChanged(arrayEquals)
        );
    heightsVisible$: Observable<number[]> = combineLatest(this.heights$, this.visibleOffset$, this.visibleEnd$)
        .pipe(
            map(([heights, offset, end]) => heights.slice(offset, end)),
            distinctUntilChanged(arrayEquals)
        );
    heightsBottom$: Observable<number[]> = combineLatest(this.heights$, this.visibleEnd$)
        .pipe(
            map(([heights, end]) => heights.slice(end)),
            distinctUntilChanged(arrayEquals)
        );

    hiddenTopPx$ = this.heightsTop$
        .pipe(
            map(arraySum),
            distinctUntilChanged()
        );
    hiddenBottomPx$ = this.heightsBottom$
        .pipe(
            map(arraySum),
            distinctUntilChanged()
        );

    viewItems$ = combineLatest(this.source$, this.visibleOffset$, this.visibleEnd$)
        .pipe(
            switchMap(([source, offset, end]) => source ? source.getData({
                offset: offset,
                limit: end - offset,
                acceptPartialResponse: true
            }) : [null]),
            map(result => result ? result.items : []),
            distinctUntilChanged(arrayEquals)
        );
    destroy$ = new Subject();

    scrollBoxUpdate$ = new Subject();
    atomState: {
        hiddenTopPx: number;
        hiddenBottomPx: number;
        heightsVisible: number[];
        items: T[];
        offset: number;
    };

    constructor(private cdr: ChangeDetectorRef,
                private elRef: ElementRef) {

    }

    ngOnInit(): void {
        this.source$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.realItemHeights$.next([]);
                this.scrollTop$.next(0);
            });

        combineLatest(this.hiddenTopPx$, this.hiddenBottomPx$, this.heightsVisible$, this.viewItems$, this.visibleOffset$)
            .pipe(
                distinctUntilChanged(arrayEquals),
                takeUntil(this.destroy$)
            )
            .subscribe(([hiddenTopPx, hiddenBottomPx, heightsVisible, items, offset]) => {
                this.atomState = {
                    hiddenTopPx,
                    hiddenBottomPx,
                    heightsVisible,
                    items,
                    offset
                };
                this.cdr.detectChanges();
                this.saveRealItemsHeight();
                this.scrollBoxUpdate$.next();
            });
    }

    ngAfterContentChecked(): void {
        this.updateSize();
    }

    @HostListener('window:resize', ['$event'])
    onResize($event) {
        this.updateSize();
    }

    updateSize() {
        this.visibleHeight$.next(this.elRef.nativeElement.offsetHeight);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<VirtualListComponent>(changes, ['source'])) {
            this.source$.next(new CachedListSource(this.source, 100));
        }
        if (hasAnyChanges<VirtualListComponent>(changes, ['minItemHeight'])) {
            this.minItemHeight$.next(this.minItemHeight);
        }
    }

    saveRealItemsHeight() {
        if (this.viewItemElements) {
            const realHeights = [...this.realItemHeights$.value];
            this.viewItemElements.forEach((item, index) => {
                realHeights[this.atomState.offset + index] = item.nativeElement.offsetHeight;
            });
            this.realItemHeights$.next(realHeights);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
