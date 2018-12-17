import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GridColumnModel} from '../../../shared/classes/grid-source/models/grid-column.model';
import {LocalGridSource} from '../../../shared/classes/grid-source/impl/local-grid-source';
import {GridSource} from '../../../shared/classes/grid-source/grid-source';

@Component({
    selector: 'app-demo-grid',
    templateUrl: './demo-grid.component.html',
    styleUrls: ['./demo-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoGridComponent implements OnInit {

    gridSource: GridSource;

    constructor() {
    }

    ngOnInit() {
        const columns = 100;
        const rows = 100;

        const gridColumns: GridColumnModel[] = [];

        for (let i = 0; i < columns; i++) {
            gridColumns.push({
                field: 'col' + i
            });
        }

        const grid = [];

        for (let i = 0; i < rows; i++) {
            const row = {};

            gridColumns.forEach(col => {
                row[col.field] = `row${i}/${String(col.field)}`;
            });

            grid.push(row);
        }

        this.gridSource = new LocalGridSource(gridColumns, grid);
    }

}
