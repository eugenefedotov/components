import {AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList} from '@angular/core';
import {TabSetTabComponent} from '../tab-set-tab/tab-set-tab.component';
import {TabSwitcherTabModel} from '../tab-switcher/models/tab-switcher-tab.model';

@Component({
    selector: 'app-tab-set',
    templateUrl: './tab-set.component.html',
    styleUrls: ['./tab-set.component.scss']
})
export class TabSetComponent implements OnInit, AfterContentInit {

    @ContentChildren(TabSetTabComponent) tabs: QueryList<TabSetTabComponent>;

    @Input() selectedTab: TabSetTabComponent;
    @Output() selectedTabChange = new EventEmitter<TabSetTabComponent>();

    tabSwitcherTabs: TabSwitcherTabModel[];
    tabSwitcherSelectedTabIndex: number;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterContentInit(): void {
    }

}
