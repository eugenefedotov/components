import {Controller} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {CurrencyRepository} from '../../../dao/currency/currency.repository';
import {CurrencyEntity} from '../../../dao/currency/currency.entity';
import {RepositoryRestControllerDataSource} from '../../../shared/data-source/impl/repository-rest-controller-data-source';
import {RepositoryDataSource} from '../../../shared/data-source/impl/repository-data-source';
import {PersistentFilterDataSource} from '../../../shared/data-source/impl/persistent-filter-data-source';
import {DataSourceRequestFilterTypeEnum} from '../../../shared/data-source/models/data-source-request-filter-type.enum';

@Controller('/currency')
export class CurrencyController extends RepositoryRestControllerDataSource<CurrencyEntity> {
    constructor() {
        const ds = new RepositoryDataSource(getCustomRepository(CurrencyRepository));

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
