import {Component, OnInit} from '@angular/core';
import {PaymentServiceCurrencyEntity} from '../../../dao/payment-service-currency/payment-service-currency.entity';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PaymentServiceCurrencyRestService} from '../../shared/shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {DataSourceRequestFilterTypeEnum} from '../../../shared/classes/data-source/models/data-source-request-filter-type.enum';

@Component({
    selector: 'app-exchange-routes',
    templateUrl: './exchange-routes.component.html',
    styleUrls: ['./exchange-routes.component.scss']
})
export class ExchangeRoutesComponent implements OnInit {

    fromPaymentServiceCurrency: PaymentServiceCurrencyEntity;
    toPaymentServiceCurrency: PaymentServiceCurrencyEntity;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService
    ) {
    }

    ngOnInit() {
        this.route.queryParamMap.pipe(
            filter(params =>
                !this.fromPaymentServiceCurrency || this.fromPaymentServiceCurrency.code !== params.get('from')
                || !this.toPaymentServiceCurrency || this.toPaymentServiceCurrency.code !== params.get('to')
            ),
            switchMap(params => this.getPaymentServiceCurrencyByParams(params))
        )
            .subscribe(result => {
                this.fromPaymentServiceCurrency = result && result.from;
                this.toPaymentServiceCurrency = result && result.to;
            });
    }

    onPaymentServiceCurrencyChange(key: string, paymentServiceCurrency: PaymentServiceCurrencyEntity) {
        this.router.navigate([], {
            queryParams: {
                [key]: paymentServiceCurrency.code
            },
            queryParamsHandling: 'merge'
        });
    }

    private getPaymentServiceCurrencyByParams(params: ParamMap): Observable<{ from: PaymentServiceCurrencyEntity, to: PaymentServiceCurrencyEntity }> {
        if (!params.has('from') && !params.has('to')) {
            return of(null);
        }

        return this.paymentServiceCurrencyRestService.getData({
            offset: 0,
            limit: 2,
            filter: [
                {
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    field: 'code',
                    values: [params.get('from'), params.get('to')].filter(Boolean)
                }
            ]
        })
            .pipe(
                map(result => {
                    const getByCode = (code: string) => result.items.find(item => item.code === code);

                    return {
                        from: getByCode(params.get('from')),
                        to: getByCode(params.get('to'))
                    };
                })
            );
    }
}
