import {Component, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {ActivatedRoute} from '@angular/router';
import {ExchangeInitParamsModel} from './exchange-init-params.model';

@Component({
    selector: 'app-exchange-init',
    templateUrl: './exchange-init.component.html',
    styleUrls: ['./exchange-init.component.scss']
})
export class ExchangeInitComponent implements OnInit {

    fromSum: number;
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { params: ExchangeInitParamsModel }) => {
            this.fromPaymentServiceCurrency = data.params.from;
            this.toPaymentServiceCurrency = data.params.to;
        });

        this.route.queryParamMap.subscribe(pm => {
            this.fromSum = Number(pm.get('fromSum'));
        });
    }

}
