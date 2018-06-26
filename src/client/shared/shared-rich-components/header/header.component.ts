import {Component, OnInit} from '@angular/core';
import {MenuEntity} from '../../../../dao/core/menu/menu.entity';
import {AppStateService} from '../../shared-services/app-state/app-state.service';
import {RestMenuService} from '../../shared-rest-services/rest-menu/rest-menu.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    menu: MenuEntity[];

    constructor(public stateService: AppStateService,
                private restMenuService: RestMenuService) {
    }

    ngOnInit() {
        this.restMenuService.getMenu().subscribe(value => this.menu = value);

    }

}
