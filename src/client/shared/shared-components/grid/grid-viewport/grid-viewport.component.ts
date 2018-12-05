import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GridColumnModel} from '../../../../../shared/classes/grid-source/models/grid-column.model';
import {DataSource} from '../../../../../shared/classes/data-source/data-source';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {hasAnyChanges} from '../../../../../functions/has-any-changes';
import {DataSourceGridSource} from '../../../../../shared/classes/grid-source/impl/data-source-grid-source';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-grid-viewport',
    templateUrl: './grid-viewport.component.html',
    styleUrls: ['./grid-viewport.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridViewportComponent<T extends Object = any> implements OnInit, OnChanges {

    @Input()
    columns: GridColumnModel<T>[];

    @Input()
    source: DataSource<T>;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    @Input()
    scrollLeft: number;

    @Output()
    scrollLeftChange = new EventEmitter<number>();

    @Input()
    scrollTop: number;

    @Output()
    scrollTopChange = new EventEmitter<number>();

    source$ = new BehaviorSubject<DataSource<T>>(null);
    columns$ = new BehaviorSubject<GridColumnModel<T>[]>([]);
    gridSource$ = combineLatest(this.source$, this.columns$)
        .pipe(
            map(([source, columns]) => source ? new DataSourceGridSource(columns, source) : null)
        );

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<GridViewportComponent>(changes, ['source'])) {
            this.source$.next(this.source);
        }
        if (hasAnyChanges<GridViewportComponent>(changes, ['columns'])) {
            this.columns$.next(this.columns);
        }
    }

}
