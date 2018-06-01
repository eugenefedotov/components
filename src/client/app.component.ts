import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PopUpService} from './shared/shared-services/services/pop-up/pop-up.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(public viewContainerRef: ViewContainerRef,
                public popUpService: PopUpService) {
    }

    ngOnInit(): void {
        this.popUpService.setViewContainerRef(this.viewContainerRef);
    }
}
