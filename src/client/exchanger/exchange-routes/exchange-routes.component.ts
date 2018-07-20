import {Component, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentServiceCurrencyPairModel} from '../resolvers/payment-service-currency-pair/payment-service-currency-pair.model';

@Component({
    selector: 'app-exchange-routes',
    templateUrl: './exchange-routes.component.html',
    styleUrls: ['./exchange-routes.component.scss']
})
export class ExchangeRoutesComponent implements OnInit {

    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { pair: PaymentServiceCurrencyPairModel }) => {
            if (data.pair) {
                this.fromPaymentServiceCurrency = data.pair.from;
                this.toPaymentServiceCurrency = data.pair.to;
            }
        });
    }

    onPaymentServiceCurrencyChange() {
        if (!this.fromPaymentServiceCurrency || !this.toPaymentServiceCurrency) {
            return;
        }

        this.router.navigate([], {
            queryParams: {
                from: this.fromPaymentServiceCurrency.code,
                to: this.toPaymentServiceCurrency.code
            }
        });
    }
}
