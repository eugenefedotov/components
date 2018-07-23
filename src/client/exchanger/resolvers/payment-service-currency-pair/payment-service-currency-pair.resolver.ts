import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PaymentServiceCurrencyPairModel} from './payment-service-currency-pair.model';
import {combineLatest, Observable} from 'rxjs';
import {PaymentServiceCurrencyRestService} from '../../../shared/shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';
import {PaymentServiceCurrencyEntity} from '../../../../dao/payment-service-currency/payment-service-currency.entity';
import {map} from 'rxjs/operators';

@Injectable()
export class PaymentServiceCurrencyPairResolver implements Resolve<PaymentServiceCurrencyPairModel> {

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaymentServiceCurrencyPairModel> | Promise<PaymentServiceCurrencyPairModel> | PaymentServiceCurrencyPairModel {
        return combineLatest(
            this.getByCode(route.queryParamMap.get('from')),
            this.getByCode(route.queryParamMap.get('to'))
        )
            .pipe(
                map(result => ({
                    from: result[0],
                    to: result[1]
                }))
            );
    }

    private getByCode(code: string): Observable<PaymentServiceCurrencyEntity> {
        return this.paymentServiceCurrencyRestService.getData({
            filter: [
                {
                    field: 'code',
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    values: [code]
                }
            ],
            offset: 0,
            limit: 1
        })
            .pipe(
                map(result => result.items && result.items[0] || null)
            );
    }
}
