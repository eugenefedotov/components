import {Component, OnInit} from '@angular/core';
import {PopUpService} from '../../../shared-services/services/pop-up/pop-up.service';

@Component({
    selector: 'app-pop-up-render-place',
    templateUrl: './pop-up-render-place.component.html',
    styleUrls: ['./pop-up-render-place.component.scss']
})
export class PopUpRenderPlaceComponent implements OnInit {

    constructor(public popUpService: PopUpService) {
    }

    ngOnInit() {
    }

}
