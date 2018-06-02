import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PopUpService} from './shared/shared-services/services/pop-up/pop-up.service';
import {AppStateService} from './shared/shared-services/services/app-state/app-state.service';
import {RestMenuService} from './shared/shared-rest-services/rest-services/rest-menu/rest-menu.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(public viewContainerRef: ViewContainerRef,
                public popUpService: PopUpService,
                private restMenuService: RestMenuService,
                private appStateService: AppStateService) {
    }

    ngOnInit(): void {
        this.popUpService.setViewContainerRef(this.viewContainerRef);
    }
}
