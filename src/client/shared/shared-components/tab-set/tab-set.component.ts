import {AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList} from '@angular/core';
import {TabComponent} from '../tab/tab.component';
import {TabSwitcherTabModel} from '../tab-switcher/models/tab-switcher-tab.model';

@Component({
    selector: 'app-tab-set',
    templateUrl: './tab-set.component.html',
    styleUrls: ['./tab-set.component.scss']
})
export class TabSetComponent implements OnInit, AfterContentInit {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    @Input() selectedTab: TabComponent;
    @Output() selectedTabChange = new EventEmitter<TabComponent>();

    tabSwitcherTabs: TabSwitcherTabModel[];
    tabSwitcherSelectedTabIndex: number;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterContentInit(): void {
    }

}
