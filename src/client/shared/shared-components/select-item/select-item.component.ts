import {Component, Input, OnInit} from '@angular/core';
import {SelectItemModel} from '../../../../shared/select-source/models/select-item.model';

@Component({
    selector: 'app-select-item',
    templateUrl: './select-item.component.html',
    styleUrls: ['./select-item.component.scss']
})
export class SelectItemComponent implements OnInit {

    @Input() item: SelectItemModel;
    @Input() selected: boolean;

    constructor() {
    }

    ngOnInit() {
    }

}
