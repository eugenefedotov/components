import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {ExchangeInitParamsModel} from './exchange-init-params.model';
import {ExchangeRestService} from '../../shared/shared-rest-services/exchange-rest/exchange-rest.service';
import {ExchangeRouteEntity} from '../../../dao/exchange-route/exchange-route.entity';
import {ExchangeEntity} from '../../../dao/exchange/exchange.entity';

@Component({
    selector: 'app-exchange-init',
    templateUrl: './exchange-init.component.html',
    styleUrls: ['./exchange-init.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeInitComponent implements OnInit {

    fromSum: number;
    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    exchangeRoute: ExchangeRouteEntity;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private exchangeRestService: ExchangeRestService) {
    }

    ngOnInit() {
        this.route.data.subscribe((data: { params: ExchangeInitParamsModel }) => {
            this.fromPaymentServiceCurrency = data.params.from;
            this.toPaymentServiceCurrency = data.params.to;
            this.cdr.markForCheck();
        });

        this.route.queryParamMap.subscribe(pm => {
            this.fromSum = Number(pm.get('fromSum'));
            this.cdr.markForCheck();
        });
    }

    onExchangeRouteChange($event: ExchangeRouteEntity) {
        this.exchangeRoute = $event;
    }

    async onExchangeClick() {
        let exchange = new ExchangeEntity();
        exchange.exchangeRoute = this.exchangeRoute;
        exchange.fromSum = this.fromSum;

        exchange = await this.exchangeRestService.initExchange(exchange).toPromise();

        await this.router.navigate(['exchange', 'exchange-status', exchange.uuid]);
    }
}
