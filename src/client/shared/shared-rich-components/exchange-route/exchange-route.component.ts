import {Component, Input, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {ExchangeRouteEntity} from '../../../../dao/exchange-route/exchange-route.entity';

@Component({
    selector: 'app-exchange-route',
    templateUrl: './exchange-route.component.html',
    styleUrls: ['./exchange-route.component.scss']
})
export class ExchangeRouteComponent implements OnInit {

    @Input()
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    @Input()
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    exchangeRoute: ExchangeRouteEntity;

    constructor() {
    }

    ngOnInit() {
    }

}
