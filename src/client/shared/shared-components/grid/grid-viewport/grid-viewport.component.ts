import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {GridColumnModel} from '../../../classes/grid-source/models/grid-column.model';
import {DataSource} from '../../../classes/data-source/data-source';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {hasAnyChanges} from '../../../../../functions/has-any-changes';
import {DataSourceGridSource} from '../../../classes/grid-source/impl/data-source-grid-source';
import {distinctUntilChanged, map, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-grid-viewport',
    templateUrl: './grid-viewport.component.html',
    styleUrls: ['./grid-viewport.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridViewportComponent<T extends Object = any> implements OnInit, OnChanges, OnDestroy {

    @Input()
    columns: GridColumnModel<T>[];

    @Input()
    source: DataSource<T>;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    @Input()
    scrollBarHorizontalShow: boolean;
    @Input()
    scrollBarVerticalShow: boolean;

    @Input()
    scrollLeft: number;

    @Output()
    scrollLeftChange = new EventEmitter<number>();

    @Input()
    scrollTop: number;

    @Output()
    scrollTopChange = new EventEmitter<number>();

    scrollTop$ = new BehaviorSubject(0);
    scrollLeft$ = new BehaviorSubject(0);

    source$ = new BehaviorSubject<DataSource<T>>(null);
    columns$ = new BehaviorSubject<GridColumnModel<T>[]>([]);
    gridSource$ = combineLatest(this.source$, this.columns$)
        .pipe(
            map(([source, columns]) => source ? new DataSourceGridSource(columns, source) : null)
        );

    destroy$ = new Subject();

    constructor() {
    }

    ngOnInit() {
        this.scrollLeft$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(scrollLeft => {
                this.scrollLeft = scrollLeft;
                this.scrollLeftChange.emit(this.scrollLeft);
            });
        this.scrollTop$
            .pipe(
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(scrollTop => {
                this.scrollTop = scrollTop;
                this.scrollTopChange.emit(this.scrollTop);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<GridViewportComponent>(changes, ['source'])) {
            this.source$.next(this.source);
        }
        if (hasAnyChanges<GridViewportComponent>(changes, ['columns'])) {
            this.columns$.next(this.columns);
        }
        if (hasAnyChanges<GridViewportComponent>(changes, ['scrollTop'])) {
            this.scrollTop$.next(this.scrollTop);
        }
        if (hasAnyChanges<GridViewportComponent>(changes, ['scrollLeft'])) {
            this.scrollLeft$.next(this.scrollLeft);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
