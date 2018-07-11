import {Component, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';

@Component({
    selector: 'app-exchange-routes',
    templateUrl: './exchange-routes.component.html',
    styleUrls: ['./exchange-routes.component.scss']
})
export class ExchangeRoutesComponent implements OnInit {

    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
