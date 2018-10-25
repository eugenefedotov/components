import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {distinctUntilChanged, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {CachedListSource} from '../../../../shared/classes/list-source/impl/cached-list-source';

interface Range {
    offset: number;
    limit: number;
}

interface Size {
    width: number;
    height: number;
}

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent<T = any> implements OnInit, OnChanges, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

    @Input() source: ListSource<T>;
    @Input() itemTemplate: TemplateRef<any>;
    @Input() minItemHeight = 32;

    @ViewChild('viewport') viewElement: ElementRef;
    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef>;

    realItemsHeight = new Map<number, number>();
    topVirtualHeightPx: number;
    bottomVirtualHeightPx: number;

    source$ = new BehaviorSubject<CachedListSource<T>>(null);
    sourceSize$ = new BehaviorSubject<number>(null);
    scrollTop$ = new BehaviorSubject<number>(0);
    viewItems$ = new Subject<T[]>();
    size$ = new Subject<Size>();
    range$ = new Subject<Range>();
    destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef, private elRef: ElementRef) {

    }

    ngOnInit(): void {
        const sourceSize$ = this.sourceSize$.pipe(distinctUntilChanged());
        const scrollTop$ = this.scrollTop$.pipe(distinctUntilChanged());
        const size$ = this.size$.pipe(distinctUntilChanged((x, y) => x.width === y.width && x.height === y.height));
        const range$ = this.range$.pipe(distinctUntilChanged((x, y) => x.offset === y.offset && x.limit === y.limit));

        sourceSize$.pipe(takeUntil(this.destroy$)).subscribe((val) => console.log('sourceSize$', val));
        scrollTop$.pipe(takeUntil(this.destroy$)).subscribe((val) => console.log('scrollTop$', val));
        size$.pipe(takeUntil(this.destroy$)).subscribe((val) => console.log('size$', val));
        range$.pipe(takeUntil(this.destroy$)).subscribe((val) => console.log('range$', val));

        this.source$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.realItemsHeight.clear();
            });

        combineLatest(
            this.source$,
            sourceSize$,
            scrollTop$,
            size$
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(([source, sourceSize, scrollTop, size]) => {
                this.range$.next(this.getRange(scrollTop, size));
            });

        combineLatest(
            this.source$,
            range$
        )
            .pipe(
                switchMap(([source, range]) => source.getData(range)
                    .pipe(
                        map(response => ({source, range, response}))
                    )),
                takeUntil(this.destroy$)
            )
            .subscribe(({source, range, response}) => {
                this.sourceSize$.next(response.count);
                this.viewItems$.next(this.getViewItems(response.items, range));
                this.cdr.detectChanges();
            });

        combineLatest(
            this.viewItems$,
            range$,
            sourceSize$
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(([viewItems, range, sourceSize]) => {
                this.updateVirtualHeights(viewItems, range, sourceSize);

                this.cdr.detectChanges();
            });
    }

    ngAfterViewInit(): void {
        const range$ = this.range$.pipe(distinctUntilChanged((x, y) => x.offset === y.offset && x.limit === y.limit));

        combineLatest(
            this.viewItemElements.changes,
            range$
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(([changes, range]) => {
                this.saveViewItemsHeight(changes, range);
            });
    }

    ngAfterViewChecked(): void {
        this.size$.next({
            width: this.elRef.nativeElement.offsetWidth,
            height: this.elRef.nativeElement.offsetHeight
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('source')) {
            this.source$.next(new CachedListSource(this.source, 100));
        }
    }

    onScrollPosChange(scrollTopPx: number) {
        this.scrollTop$.next(scrollTopPx);
    }

    getMinItemHeight(): number {
        if (this.realItemsHeight.size) {
            return Math.min(...this.realItemsHeight.values());
        } else {
            return this.minItemHeight;
        }
    }

    getRangeHeight(offset: number, end: number): number {
        let height = 0;
        let _minHeight;
        const minHeight = () => _minHeight || (_minHeight = this.getMinItemHeight());

        for (let i = offset; i <= end; i++) {
            if (this.realItemsHeight.has(i)) {
                height += this.realItemsHeight.get(i);
            } else {
                height += minHeight();
            }
        }

        return height;
    }

    getIndexByOffsetAndTop(offsetIndex: number, top: number) {
        let heightSum = 0;
        const minHeight = this.getMinItemHeight();

        while (true) {
            if (this.realItemsHeight.has(offsetIndex)) {
                heightSum += this.realItemsHeight.get(offsetIndex);
            } else {
                heightSum += minHeight;
            }

            if (heightSum < top) {
                offsetIndex++;
            } else {
                break;
            }
        }

        return offsetIndex;
    }

    updateVirtualHeights(viewItems: T[], range: Range, sourceSize: number) {
        this.topVirtualHeightPx = this.getRangeHeight(0, range.offset - 1);
        this.bottomVirtualHeightPx = this.getRangeHeight(range.offset + viewItems.length, sourceSize - 1);
    }

    saveViewItemsHeight(changes, range: Range) {
        if (this.viewItemElements) {
            this.viewItemElements.forEach((item, index) => {
                this.realItemsHeight.set(range.offset + index, item.nativeElement.offsetHeight);
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getViewItems(items: T[], range: Range): T[] {
        return items.slice(range.offset, range.offset + range.limit);
    }

    private getRange(scrollTop: number, size: Size): Range {
        const offset = this.getIndexByOffsetAndTop(0, scrollTop);
        const limit = this.getIndexByOffsetAndTop(offset, size.height) - offset + 1;

        return {offset, limit};
    }
}
