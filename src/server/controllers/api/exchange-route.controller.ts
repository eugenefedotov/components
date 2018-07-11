import {Controller} from '@tsed/common';
import {RepositoryRestControllerDataSource} from '../../../shared/data-source/impl/repository-rest-controller-data-source';
import {ExchangeRouteEntity} from '../../../dao/exchange-route/exchange-route.entity';
import {getCustomRepository} from 'typeorm';
import {ExchangeRouteRepository} from '../../../dao/exchange-route/exchange-route.repository';

@Controller('/exchange-route')
export class ExchangeRouteController extends RepositoryRestControllerDataSource<ExchangeRouteEntity> {
    constructor() {
        super(getCustomRepository(ExchangeRouteRepository));
    }
}
