import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SelectSource} from '../../../shared/classes/select-source/select-source';
import {LocalSelectSource} from '../../../shared/classes/select-source/impl/local-select-source';
import {SelectItemModel} from '../../../shared/classes/select-source/models/select-item.model';

@Component({
    selector: 'app-demo-select',
    templateUrl: './demo-select.component.html',
    styleUrls: ['./demo-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoSelectComponent implements OnInit {

    source: SelectSource;

    constructor() {
    }

    ngOnInit() {
        const items: SelectItemModel[] = [];

        for (let i = 0; i < 1000; i++) {
            items.push({
                name: `item ${i}`,
                value: i
            });
        }


        this.source = new LocalSelectSource(items);
    }

}
