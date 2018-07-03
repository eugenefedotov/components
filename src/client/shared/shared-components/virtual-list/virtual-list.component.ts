import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef, EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit, Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {ListSource} from '../../../../shared/list-source/list-source';
import {Subject} from 'rxjs';
import {ListSourceResponseModel} from '../../../../shared/list-source/models/list-source-response.model';
import {EqualsComparator} from '../../../../shared/comparator/equals-comparator';
import {Comparator} from '../../../../shared/comparator/comparator';

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

    @Input() selectedItem: any;
    @Output() selectedItemChange = new EventEmitter<any>();

    @Input() comparator: Comparator<any> = new EqualsComparator();

    @Input() source: ListSource<any>;
    @Input() itemTemplate: TemplateRef<any>;
    @Input() pageSize = 100;

    itemsPageCache = new Map<number, any[]>();
    heightsCache = new Map<number, number>();

    viewOffset: number;
    viewLimit: number;
    sourceSize: number;

    viewItems$ = new Subject<any[]>();
    spinnerDisplay = false;

    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef>;

    @ViewChild('top') topElement: ElementRef<HTMLElement>;
    @ViewChild('view') viewElement: ElementRef<HTMLElement>;
    @ViewChild('bottom') bottomElement: ElementRef<HTMLElement>;

    constructor(private hostElement: ElementRef<HTMLElement>) {
    }

    ngOnInit() {
    }

    getPageByOffset(offset: number) {
        return Math.floor(offset / this.pageSize);
    }

    clearCache() {
        this.itemsPageCache.clear();
        this.heightsCache.clear();
    }

    updateViewRange() {

    }

    toCacheItems(offset: number, items: any[]) {
        // дополнительный сдвиг, для выравнивания по страницам
        const addOffset = Math.ceil(offset / this.pageSize) * this.pageSize - offset;
        let currentOffset = offset;

        while (currentOffset + addOffset + this.pageSize <= items.length + offset) {
            const page = this.getPageByOffset(offset + addOffset);

            if (!this.itemsPageCache.has(page)) {

            }

            currentOffset += this.pageSize;
        }
    }

    async getItems(offset: number, limit: number): Promise<ListSourceResponseModel<any>> {
        if (!this.source) {
            return {count: 0, items: []};
        }

        const end = offset + limit;

        const itemsStart = [];
        const itemsEnd = [];
        let offsetToLoad = offset;
        let endToLoad = end;

        while (offsetToLoad < endToLoad && this.itemsPageCache.has(this.getPageByOffset(offsetToLoad))) {
            itemsStart.push(...this.itemsPageCache.get(this.getPageByOffset(offsetToLoad)));
            offsetToLoad += this.pageSize;
        }

        while (offsetToLoad < endToLoad && this.itemsPageCache.has(this.getPageByOffset(endToLoad))) {
            itemsEnd.splice(0, 0, ...this.itemsPageCache.get(this.getPageByOffset(endToLoad)));
            endToLoad -= this.pageSize;
        }

        if (endToLoad - offsetToLoad > 0) {
            const {items, count} = await this.source.getItems(offsetToLoad, endToLoad - offsetToLoad);
            this.toCacheItems(offsetToLoad, items);

            return {
                items: [...itemsStart, ...items, ...itemsEnd],
                count: this.sourceSize = count
            };
        } else {
            return {
                items: [...itemsStart, ...itemsEnd],
                count: this.sourceSize
            };
        }
    }

    async updateItems() {
        const {items, count} = await this.getItems(this.viewOffset, this.viewLimit);
        this.sourceSize = count;
        this.viewItems$.next(items);
    }

    async onSourceChange() {
        this.viewOffset = 0;
        this.viewLimit = this.pageSize;
        this.sourceSize = 0;
        this.viewItems$.next([]);
        this.clearCache();

        if (this.source) {
            await this.updateItems();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('source')) {
            this.onSourceChange();
        }
    }

    ngAfterViewChecked() {

    }

    ngOnDestroy() {

    }
}
