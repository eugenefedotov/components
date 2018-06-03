import {Component, Input, OnInit} from '@angular/core';
import {MenuEntity} from '../../../../../../dao/core/menu/menu.entity';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    @Input() menuItems: MenuEntity[];

    constructor() {
    }

    ngOnInit() {
    }

}
