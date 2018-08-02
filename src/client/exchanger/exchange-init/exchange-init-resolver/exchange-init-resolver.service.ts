import {Injectable} from '@angular/core';
import {ExchangeInitParamsModel} from '../exchange-init-params.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DataSourceRequestFilterTypeEnum} from '../../../../shared/classes/data-source/models/data-source-request-filter-type.enum';
import {map} from 'rxjs/operators';
import {PaymentServiceCurrencyRestService} from '../../../shared/shared-rest-services/payment-service-currency-rest/payment-service-currency-rest.service';

@Injectable({
    providedIn: 'root'
})
export class ExchangeInitResolverService implements Resolve<ExchangeInitParamsModel> {

    constructor(private paymentServiceCurrencyRestService: PaymentServiceCurrencyRestService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExchangeInitParamsModel> | Promise<ExchangeInitParamsModel> | ExchangeInitParamsModel {
        return this.getPaymentServiceCurrencyByParams(route.paramMap.get('from'), route.paramMap.get('to'));
    }

    private getPaymentServiceCurrencyByParams(from: string, to: string): Observable<ExchangeInitParamsModel> {
        return this.paymentServiceCurrencyRestService.getData({
            offset: 0,
            limit: 2,
            filter: [
                {
                    type: DataSourceRequestFilterTypeEnum.Equal,
                    field: 'code',
                    values: [from, to].filter(Boolean)
                }
            ]
        })
            .pipe(
                map(result => {
                    const getByCode = (code: string) => result.items.find(item => item.code === code);

                    return {
                        from: getByCode(from),
                        to: getByCode(to)
                    };
                })
            );
    }
}
