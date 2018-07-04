import {
    AfterViewChecked,
    ChangeDetectionStrategy,
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
import {Subject} from 'rxjs';
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

    async updateItems() {
        const {items, count} = await this.source.getItems(this.viewOffset, this.viewLimit);
        this.sourceSize = count;
        this.viewItems$.next(items);
    }

    async onSourceChange() {
        this.viewOffset = 0;
        this.viewLimit = this.pageSize;
        this.sourceSize = 0;
        this.viewItems$.next([]);
        this.heightsCache.clear();

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
