import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PopUpService} from './shared/shared-services/pop-up/pop-up.service';

@Component({
    selector: 'app-root',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

    constructor(public viewContainerRef: ViewContainerRef,
                public popUpService: PopUpService) {
    }

    ngOnInit(): void {
        this.popUpService.setViewContainerRef(this.viewContainerRef);
    }

}
