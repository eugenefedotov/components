import {Component, OnInit} from '@angular/core';
import {WaiterService} from '../../../../shared/shared-services/waiter/waiter.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    constructor(private waiterService: WaiterService) {
    }

    ngOnInit() {
        this.waiterService.show('test');
    }

}
