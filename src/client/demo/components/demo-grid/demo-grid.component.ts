import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GridColumnModel} from '../../../../shared/classes/grid-source/models/grid-column.model';
import {LocalGridSource} from '../../../../shared/classes/grid-source/impl/local-grid-source';
import {GridSource} from '../../../../shared/classes/grid-source/grid-source';

interface DemoGridRow {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
}

@Component({
    selector: 'app-demo-grid',
    templateUrl: './demo-grid.component.html',
    styleUrls: ['./demo-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoGridComponent implements OnInit {

    gridSource: GridSource<DemoGridRow>;

    constructor() {
    }

    ngOnInit() {
        const gridColumns: GridColumnModel<DemoGridRow>[] = [
            {
                field: 'col1'
            },
            {
                field: 'col2'
            },
            {
                field: 'col3'
            },
            {
                field: 'col4'
            },
        ];

        const grid: DemoGridRow[] = [];

        for (let i = 0; i < 100; i++) {
            grid.push({
                col1: `r${i}col1`,
                col2: `r${i}col2`,
                col3: `r${i}col3`,
                col4: `r${i}col4`
            });
        }

        this.gridSource = new LocalGridSource<DemoGridRow>(gridColumns, grid);
    }

}
