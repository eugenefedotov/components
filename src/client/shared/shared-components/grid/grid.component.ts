import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GridColumnModel} from './models/grid-column.model';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {Subject} from 'rxjs';
import {hasAnyChanges} from '../../../../functions/has-any-changes';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent<T extends Object = any> implements OnInit, OnChanges {

    @Input()
    columns: GridColumnModel<T>[];

    @Input()
    source: ListSource<T>;

    @Input()
    viewTitles = true;

    @Input()
    holdTop = 0;

    @Input()
    holdLeft = 0;

    @Input()
    holdRight = 0;

    @Input()
    holdBottom = 0;

    top$ = new Subject<number>();
    left$ = new Subject<number>();

    topSource$ = new Subject<ListSource<T>>();
    middleSource$ = new Subject<ListSource<T>>();
    bottomSource$ = new Subject<ListSource<T>>();

    leftColumns$ = new Subject<GridColumnModel<T>[]>();
    centerColumns$ = new Subject<GridColumnModel<T>[]>();
    rightColumns$ = new Subject<GridColumnModel<T>[]>();

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (hasAnyChanges<GridComponent>(changes, ['source', 'holdTop']))
    }
}
