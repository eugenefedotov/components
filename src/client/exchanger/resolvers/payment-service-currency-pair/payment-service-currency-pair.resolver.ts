import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {PaymentServiceCurrencyPairModel} from './payment-service-currency-pair.model';
import {Observable} from 'rxjs';
import {PaymentServiceCurrencyRestService} from '../../../shared/shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/data-source/models/data-source-request-filter-type.enum';

@Injectable()
export class PaymentServiceCurrencyPairResolver implements Resolve<PaymentServiceCurrencyPairModel> {

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaymentServiceCurrencyPairModel> | Promise<PaymentServiceCurrencyPairModel> | PaymentServiceCurrencyPairModel {
        return this._resolve(route.queryParamMap.get('from'), route.queryParamMap.get('to'));
    }

    private async _resolve(from: string, to: string): Promise<PaymentServiceCurrencyPairModel> {
        if (!from || !to) {
            return null;
        }

        const result = await this.paymentServiceCurrencyRestService.getData({
            filter: [
                {
                    field: 'code',
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    values: [from, to]
                }
            ],
            offset: 0,
            limit: 2
        });

        if (result.count !== 2) {
            return null;
        }

        const items = result.items;

        return <PaymentServiceCurrencyPairModel> {
            from: items[0],
            to: items[1]
        };
    }
}
