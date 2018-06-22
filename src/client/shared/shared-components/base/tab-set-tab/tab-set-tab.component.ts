import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-tab-set-tab',
    templateUrl: './tab-set-tab.component.html',
    styleUrls: ['./tab-set-tab.component.scss']
})
export class TabSetTabComponent implements OnInit {

    @Input() title: string;
    @Input() selected = false;

    constructor() {
    }

    ngOnInit() {
    }

}
