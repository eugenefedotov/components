import {
    AfterViewChecked,
    ChangeDetectionStrategy,
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
import {ListSource} from '../../../../../../shared/list-source/list-source';
import {Subject} from 'rxjs';
import {ListSourceResponseModel} from '../../../../../../shared/list-source/models/list-source-response.model';

@Component({
    selector: 'app-virtual-list',
    templateUrl: './virtual-list.component.html',
    styleUrls: ['./virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualListComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {

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

    clearCache() {
        this.itemsPageCache.clear();
        this.heightsCache.clear();
    }

    updateViewRange() {

    }

    async getItems(offset: number, limit: number): Promise<ListSourceResponseModel<any>> {
        if (!this.source) {
            return {count: 0, items: []};
        }

        const end = offset + limit;

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
