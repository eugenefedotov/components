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
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ListSource} from '../../../../shared/list-source/list-source';
import {EqualsComparator} from '../../../../shared/comparator/equals-comparator';
import {Comparator} from '../../../../shared/comparator/comparator';
import {CachedListSource} from '../../../../shared/list-source/impl/cached-list-source';
import {hasAnyChanges} from '../../../../functions/has-any-changes';

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent<T = any> implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

    @Input() selectedItem: T;
    @Output() selectedItemChange = new EventEmitter<T>();

    @Input() comparator: Comparator<T> = new EqualsComparator();

    @Input() source: ListSource<T>;
    @Input() itemTemplate: TemplateRef<any>;
    @Input() expectItemHeight = 32;

    realItemsHeight = new Map<number, number>();
    cachedSource: CachedListSource<T>;
    sourceSize: number;

    offsetIndex: number;
    viewportItems: T[] = [];

    topVirtualHeight = 0;
    bottomVirtualHeight = 0;

    scrollSize = 1;
    scrollPos = 0;

    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef<HTMLElement>>;
    @ViewChild('viewport') viewElement: ElementRef<HTMLElement>;

    constructor(private hostElement: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['source'])) {
            this.updateCachedSource();
        }
    }

    getAvgHeight(): number {
        if (this.realItemsHeight.size) {
            return [...this.realItemsHeight.values()].reduce((p, c) => p + c) / this.realItemsHeight.size;
        } else {
            return this.expectItemHeight;
        }
    }

    getSliceHeight(offset: number, limit: number): number {
        let height = 0;
        let _avgHeight;
        const avgHeight = () => _avgHeight || (_avgHeight = this.getAvgHeight());

        for (let i = 0; i < limit; i++) {
            const index = offset + i;
            if (this.realItemsHeight.has(index)) {
                height += this.realItemsHeight.get(index);
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

    getScrollOffsetTop(): number {
        return this.hostElement.nativeElement.offsetHeight / this.scrollSize * this.scrollPos;
    }

    getViewportOffsetIndex(): number {
        const offsetTop = this.getScrollOffsetTop();
        return Math.floor(offsetTop / this.getAvgHeight());
    }

    getViewportRange(): { offset: number, limit: number } {
        return {
            offset: this.getViewportOffsetIndex(),
            limit: this.getViewportLimitIndex()
        };
    }

    ngOnInit() {

    }

    ngAfterViewChecked() {
        this.saveViewItemsHeight();
        this.updateVirtualHeights();
    }

    onScrollSizeChange(size: number) {
        this.scrollSize = size;
        this.updateAll();
    }

    onScrollPosChange(pos: number) {
        this.scrollPos = pos;
        this.updateAll();
    }

    saveViewItemsHeight() {
        this.viewItemElements.forEach((item, index) => {
            this.realItemsHeight.set(this.offsetIndex + index, item.nativeElement.offsetHeight);
        });
    }

    updateCachedSource() {
        this.offsetIndex = 0;
        this.sourceSize = 0;
        this.viewportItems = [];
        this.realItemsHeight.clear();
        this.cachedSource = new CachedListSource(this.source, 100);

        this.updateAll();
    }

    async updateAll() {
        const {offset, limit} = this.getViewportRange();

        if (this.offsetIndex === offset && this.viewportItems.length === limit) {
            return;
        }

        const result = await this.cachedSource.getItems(offset, limit);
        this.offsetIndex = offset;
        this.sourceSize = result.count;
        this.viewportItems = result.items;

        this.cdr.detectChanges();

        this.updateVirtualHeights();
    }

    updateVirtualHeights() {
        const topOffset = this.offsetIndex - 1;
        const bottomOffset = this.offsetIndex + this.viewportItems.length;

        this.topVirtualHeight = this.getSliceHeight(0, topOffset);
        this.bottomVirtualHeight = this.getSliceHeight(bottomOffset, this.sourceSize - bottomOffset);

        this.cdr.detectChanges();
    }

    ngOnDestroy() {

    }
}
