import {Component, OnInit} from '@angular/core';
import {AppStateService} from '../../../shared-services/services/app-state/app-state.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(public stateService: AppStateService) {
    }

    ngOnInit() {
    }

}
