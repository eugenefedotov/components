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
import {CachedListSource} from '../../../../shared/list-source/impl/cached-list-source';
import {hasAnyChanges} from '../../../../functions/has-any-changes';

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
    @Input() pageSize = 100;
    @Input() itemTemplate: TemplateRef<any>;


    cachedSource: CachedListSource<any>;
    viewOffset: number;
    sourceSize: number;

    viewItems$ = new Subject<any[]>();

    verticalRelativeScrollPosition = 0;

    @ViewChildren('viewItem') viewItemElements: QueryList<ElementRef>;

    @ViewChild('top') topElement: ElementRef<HTMLElement>;
    @ViewChild('view') viewElement: ElementRef<HTMLElement>;
    @ViewChild('bottom') bottomElement: ElementRef<HTMLElement>;

    constructor(private hostElement: ElementRef<HTMLElement>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges(changes, ['source', 'pageSize'])) {
            this.clearCache();
            this.updateCachedSource();
        }
    }

    ngOnInit() {

    }

    ngAfterViewChecked() {

    }

    clearCache() {
        this.viewOffset = 0;
        this.sourceSize = 0;
        this.viewItems$.next([]);
    }

    updateCachedSource() {
        this.cachedSource = new CachedListSource(this.source, this.pageSize);
    }

    ngOnDestroy() {

    }
}
