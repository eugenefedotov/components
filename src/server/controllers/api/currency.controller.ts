import {Controller} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {CurrencyRepository} from '../../../dao/currency/currency.repository';
import {CurrencyEntity} from '../../../dao/currency/currency.entity';
import {RepositoryRestControllerDataSource} from '../../../shared/data-source/impl/repository-rest-controller-data-source';

@Controller('/currency')
export class CurrencyController extends RepositoryRestControllerDataSource<CurrencyEntity> {
    constructor() {
        super(getCustomRepository(CurrencyRepository));
    }
}
