import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ListSource} from '../../../../shared/classes/list-source/list-source';
import {LocalListSource} from '../../../../shared/classes/list-source/impl/local-list-source';
import {GridColumnModel} from '../../../shared/shared-components/grid/models/grid-column.model';

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

    gridColumns: GridColumnModel<DemoGridRow>[];
    gridSource: ListSource<DemoGridRow>;

    constructor() {
    }

    ngOnInit() {
        this.gridColumns = [
            {
                key: 'col1'
            },
            {
                key: 'col2'
            },
            {
                key: 'col3'
            },
            {
                key: 'col4'
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

        this.gridSource = new LocalListSource<DemoGridRow>(grid);
    }

}
