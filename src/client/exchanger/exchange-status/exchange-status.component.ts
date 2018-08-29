import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ExchangeEntity} from '../../../dao/exchange/exchange.entity';

@Component({
    selector: 'app-exchange-status',
    templateUrl: './exchange-status.component.html',
    styleUrls: ['./exchange-status.component.scss']
})
export class ExchangeStatusComponent implements OnInit {

    private exchange: ExchangeEntity;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { exchange: ExchangeEntity }) => {
            this.exchange = data.exchange;
        });
    }

}
