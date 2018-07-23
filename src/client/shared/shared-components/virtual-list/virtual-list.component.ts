import {
    AfterContentChecked,
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
    QueryList,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ListSource} from '../../../../shared/list-source/list-source';
import {EqualsComparator} from '../../../../shared/comparator/impl/equals-comparator';
import {Comparator} from '../../../../shared/comparator/comparator';
import {CachedListSource} from '../../../../shared/list-source/impl/cached-list-source';
import {hasAnyChanges} from '../../../../functions/has-any-changes';
import {Subject} from 'rxjs';
import {takeUntil, throttleTime} from 'rxjs/operators';

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent<T = any> implements OnInit, OnChanges, OnInit, AfterViewChecked, AfterContentChecked, OnDestroy {

    @Input() selectable = true;
    @Input() deselectable = false;
    @Input() selectedItem: T;
    @Output() selectedItemChange = new EventEmitter<T>();

    @Output() itemClick = new EventEmitter<T>();

    @Input() comparator: Comparator<T> = new EqualsComparator();

    @Input() source: ListSource<T>;
    @Input() itemTemplate: TemplateRef<any>;
    @Input() expectItemHeight = 32;

    realItemsHeight = new Map<number, number>();
    cachedSource: CachedListSource<T>;
    sourceSize: number;

    offsetIndex: number;
    viewportItems: T[] = [];

    needUpdate$ = new Subject();
    detectChanges$ = new Subject();
    destroy$ = new Subject();

    loading = false;
    scrollPosPx = 0;

    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef<HTMLElement>>;
    @ViewChild('viewport') viewElement: ElementRef<HTMLElement>;

    @ViewChild('topVirtual') topVirtual: ElementRef<HTMLElement>;
    @ViewChild('bottomVirtual') bottomVirtual: ElementRef<HTMLElement>;

    constructor(private hostElement: ElementRef<HTMLElement>,
                private cdr: ChangeDetectorRef,
                private renderer: Renderer2
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['source'])) {
            this.updateCachedSource();
        }
    }

    ngOnInit() {
        this.needUpdate$
            .pipe(
                throttleTime(10),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.updateAll());

        this.detectChanges$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.cdr.detectChanges());
    }

    onItemClick(item: T) {
        if (this.selectable) {
            this.selectItem(item);
        }

        this.itemClick.emit(item);
    }

    selectItem(item: T) {
        if (this.deselectable && this.selectedItem === item) {
            this.selectedItem = null;
            this.selectedItemChange.emit(this.selectedItem);
        }
        if (this.selectable && this.selectedItem !== item) {
            this.selectedItem = item;
            this.selectedItemChange.emit(this.selectedItem);
        }
    }

    getAvgHeight(): number {
        if (this.realItemsHeight.size) {
            return [...this.realItemsHeight.values()].reduce((p, c) => p + c) / this.realItemsHeight.size;
        } else {
            return this.expectItemHeight;
        }
    }

    getRangeHeight(offset: number, end: number): number {
        let height = 0;
        let _avgHeight;
        const avgHeight = () => _avgHeight || (_avgHeight = this.getAvgHeight());

        for (let i = offset; i <= end; i++) {
            if (this.realItemsHeight.has(i)) {
                height += this.realItemsHeight.get(i);
            } else {
                height += avgHeight();
            }
        }

        return height;
    }

    getViewportLimitIndex(): number {
        const height = this.hostElement.nativeElement.offsetHeight;
        return Math.ceil(height / this.getAvgHeight());
    }

    getScrollOffsetTopPx(): number {
        return this.scrollPosPx;
    }

    getViewportOffsetIndex(): number {
        const offsetTop = this.getScrollOffsetTopPx();
        return Math.floor(offsetTop / this.getAvgHeight());
    }

    getViewportRange(): { offset: number, limit: number } {
        return {
            offset: this.getViewportOffsetIndex(),
            limit: this.getViewportLimitIndex() + 1
        };
    }

    ngAfterViewChecked() {
        this.saveViewItemsHeight();
        this.updateVirtualHeights();

        this.needUpdate$.next();
    }

    ngAfterContentChecked(): void {
        this.saveViewItemsHeight();
        this.updateVirtualHeights();

        this.needUpdate$.next();
    }

    onScrollPosChange(pos: number) {
        this.scrollPosPx = pos;
        this.needUpdate$.next();
    }

    onScrollSizeChange($event: number) {
        this.needUpdate$.next();
    }

    saveViewItemsHeight() {
        if (this.viewItemElements) {
            this.viewItemElements.forEach((item, index) => {
                this.realItemsHeight.set(this.offsetIndex + index, item.nativeElement.offsetHeight);
            });
        }
    }

    updateCachedSource() {
        this.offsetIndex = 0;
        this.sourceSize = 0;
        this.viewportItems = [];
        this.realItemsHeight.clear();
        this.scrollPosPx = 0;

        this.cachedSource = new CachedListSource(this.source, 500);

        this.needUpdate$.next();
    }

    async updateAll() {
        const {offset, limit} = this.getViewportRange();

        if (this.offsetIndex === offset && this.viewportItems.length === limit) {
            return;
        }

        this.loading = true;
        this.cachedSource.getData({offset, limit})
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(result => {
                this.loading = false;
                this.offsetIndex = offset;
                this.sourceSize = result.count;
                this.viewportItems = result.items;

                this.updateVirtualHeights();
                this.detectChanges$.next();
            });
    }

    updateVirtualHeights() {
        const topVirtualHeightPx = this.getRangeHeight(0, this.offsetIndex - 1);
        const bottomVirtualHeightPx = this.getRangeHeight(this.offsetIndex + this.viewportItems.length + 2, this.sourceSize);

        this.renderer.setStyle(this.topVirtual.nativeElement, 'height', topVirtualHeightPx + 'px');
        this.renderer.setStyle(this.bottomVirtual.nativeElement, 'height', bottomVirtualHeightPx + 'px');

        this.detectChanges$.next();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
