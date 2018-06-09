import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TabSwitcherTabModel} from './models/tab-switcher-tab.model';

@Component({
    selector: 'app-tab-switcher',
    templateUrl: './tab-switcher.component.html',
    styleUrls: ['./tab-switcher.component.scss']
})
export class TabSwitcherComponent implements OnInit {

    @Input() tabs: TabSwitcherTabModel[];

    @Input() canAdding = false;
    @Input() canDelete = false;
    @Input() canSort = false;

    @Output() addClick = new EventEmitter<MouseEvent>();
    @Output() deleteClick = new EventEmitter<MouseEvent>();
    @Output() afterSort = new EventEmitter<TabSwitcherTabModel[]>();

    constructor() {
    }

    ngOnInit() {
    }

}
