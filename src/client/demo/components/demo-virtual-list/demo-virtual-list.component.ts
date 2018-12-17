import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ListSource} from '../../../shared/classes/list-source/list-source';
import {LocalListSource} from '../../../shared/classes/list-source/impl/local-list-source';

@Component({
    selector: 'app-demo-virtual-list',
    templateUrl: './demo-virtual-list.component.html',
    styleUrls: ['./demo-virtual-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoVirtualListComponent implements OnInit {

    source: ListSource<any>;

    constructor() {
    }

    ngOnInit() {
        const items = [];

        for (let i = 0; i < 1000; i++) {
            items.push({
                name: `list item ${i}`,
                value: i,
                height: Math.random() * 44 + 44
            });
        }


        this.source = new LocalListSource(items);
    }

}
