import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PopUpService} from '../shared/shared-services/pop-up/pop-up.service';

@Component({
    selector: 'app-app',
    templateUrl: './exchanger.component.html',
    styleUrls: ['./exchanger.component.scss']
})
export class ExchangerComponent implements OnInit {

    constructor(public viewContainerRef: ViewContainerRef,
                public popUpService: PopUpService) {
    }

    ngOnInit(): void {
        this.popUpService.setViewContainerRef(this.viewContainerRef);
    }

}
