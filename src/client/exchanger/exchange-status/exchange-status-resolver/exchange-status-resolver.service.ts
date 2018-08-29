import {Injectable} from '@angular/core';
import {ExchangeRestService} from '../../../shared/shared-rest-services/exchange-rest/exchange-rest.service';
import {ExchangeEntity} from '../../../../dao/exchange/exchange.entity';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class ExchangeStatusResolverService implements Resolve<ExchangeEntity> {

    constructor(private exchangeRestService: ExchangeRestService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExchangeEntity> | Promise<ExchangeEntity> | ExchangeEntity {
        return this.exchangeRestService.getByUuid(route.paramMap.get('uuid'));
    }
}
