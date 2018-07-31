import {Controller} from '@tsed/common';
import {RepositoryRestControllerDataSource} from '../../../shared/classes/data-source/impl/repository-rest-controller-data-source';
import {ExchangeRouteEntity} from '../../../dao/exchange-route/exchange-route.entity';
import {getCustomRepository} from 'typeorm';
import {ExchangeRouteRepository} from '../../../dao/exchange-route/exchange-route.repository';
import {RepositoryDataSource} from '../../../shared/classes/data-source/impl/repository-data-source';
import {PersistentFilterDataSource} from '../../../shared/classes/data-source/impl/persistent-filter-data-source';
import {DataSourceRequestFilterTypeEnum} from '../../../shared/classes/data-source/models/data-source-request-filter-type.enum';

@Controller('/exchange-route')
export class ExchangeRouteController extends RepositoryRestControllerDataSource<ExchangeRouteEntity> {
    constructor() {
        const ds = new RepositoryDataSource(getCustomRepository(ExchangeRouteRepository));

        const fds = new PersistentFilterDataSource(ds, [
            {
                field: 'isEnabled',
                type: DataSourceRequestFilterTypeEnum.Equal,
                values: [true]
            }
        ]);

        super(fds);
    }
}
