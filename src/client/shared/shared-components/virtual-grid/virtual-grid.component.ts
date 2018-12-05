import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GridSource} from '../../../../shared/classes/grid-source/grid-source';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {hasAnyChanges} from '../../../../functions/has-any-changes';

@Component({
    selector: 'app-virtual-grid',
    templateUrl: './virtual-grid.component.html',
    styleUrls: ['./virtual-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualGridComponent<T extends Object = any> implements OnInit, OnChanges {

    @Input()
    source: GridSource<T>;

    @Input()
    widths: number[];

    @Input()
    heights: number[];

    source$ = new BehaviorSubject<GridSource<T>>(null);

    widths$ = new BehaviorSubject<number[]>([]);
    heights$ = new BehaviorSubject<number[]>([]);

    rowOffset$ = new BehaviorSubject(0);
    rowEnd$ = new BehaviorSubject(0);
    colOffset$ = new BehaviorSubject(0);
    colEnd$ = new BehaviorSubject(0);

    columns$ = this.source$
        .pipe(
            switchMap(source => source.getColumns())
        );
    rowsCount$ = this.source$
        .pipe(
            switchMap(source => source.getData({
                offset: 0,
                limit: 0
            })),
            map(result => result.count)
        );


    visibleColumns$ = combineLatest(this.columns$, this.colOffset$, this.colEnd$)
        .pipe(
            map(([columns, start, end]) => columns.slice(start, end))
        );
    visibleRows$ = combineLatest(this.source$, this.visibleColumns$, this.rowOffset$, this.rowEnd$)
        .pipe(
            switchMap(([source, columns, start, end]) => source.getData({
                offset: start,
                limit: end - start,
                fields: columns.map(column => column.field)
            })),
            map(result => result.items)
        );
    visibleWidths$ = combineLatest(this.widths$, this.colOffset$, this.colEnd$)
        .pipe(
            map(([widths, offset, end]) => widths.slice(offset, end))
        );
    visibleHeights$ = combineLatest(this.heights$, this.rowOffset$, this.rowEnd$)
        .pipe(
            map(([heights, offset, end]) => heights.slice(offset, end))
        );

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (hasAnyChanges<VirtualGridComponent>(changes, ['source'])) {
            this.source$.next(this.source);
        }
        if (hasAnyChanges<VirtualGridComponent>(changes, ['widths'])) {
            this.widths$.next(this.widths);
        }
        if (hasAnyChanges<VirtualGridComponent>(changes, ['heights'])) {
            this.heights$.next(this.heights);
        }
    }

}
