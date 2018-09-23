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
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
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
    @Input() minItemHeight = 29;

    @ViewChild('virtualList') virtualListElement: ElementRef;
    @ViewChild('viewport') viewElement: ElementRef;
    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef>;

    realItemsHeight = new Map<number, number>();
    topVirtualHeightPx: number;
    bottomVirtualHeightPx: number;

    source$ = new BehaviorSubject<CachedListSource<T>>(null);
    scrollTop$ = new BehaviorSubject<number>(0);
    viewItems$ = new Subject<T[]>();
    size$ = new Subject<Size>();
    range$ = new Subject<Range>();

    destroy$ = new Subject();

    constructor(private cdr: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        const scrollTop$ = this.scrollTop$.pipe(distinctUntilChanged());
        const size$ = this.size$.pipe(distinctUntilChanged((x, y) => x.width === y.width && x.height === y.height));
        const range$ = this.range$.pipe(distinctUntilChanged((x, y) => x.offset === y.offset && x.limit === y.limit));

        this.source$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.realItemsHeight.clear();
            });

        combineLatest(
            this.source$,
            scrollTop$,
            size$
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(([source, scrollTop, size]) => {
                const range = this.getRange(scrollTop, size);
                let end = range.offset + range.limit;

                end = Math.min(items.length, end + 2);

                range.limit = end - range.offset;

                this.range$.next(range);
            });

        combineLatest(
            this.source$,
            range$
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(([source, range]) => {
                this.viewItems$.next(this.getViewItems(items, range));

                if (range.offset + range.limit === items.length) {
                    this.end.emit({end: range.offset + range.limit});
                }

                this.cdr.detectChanges();
            });

        combineLatest(
            this.viewItems$,
            range$,
            this.source$
        )
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(([viewItems, range, source]) => {
                this.updateVirtualHeights(viewItems, range, items);

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
            width: this.virtualListElement.nativeElement.offsetWidth,
            height: this.virtualListElement.nativeElement.offsetHeight
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('source')) {
            this.source$.next(new CachedListSource(this.source, 100));
        }
    }

    onScroll($event: WheelEvent) {
        this.scrollTop$.next(this.virtualListElement.nativeElement.scrollTop);
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

    updateVirtualHeights(viewItems: T[], range: Range, items: T[]) {
        this.topVirtualHeightPx = this.getRangeHeight(0, range.offset - 1);
        this.bottomVirtualHeightPx = this.getRangeHeight(range.offset + viewItems.length, items.length - 1);
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
