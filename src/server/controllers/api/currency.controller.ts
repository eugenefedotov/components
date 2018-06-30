import {BodyParams, Controller, Post} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {CurrencyRepository} from '../../../dao/currency/currency.repository';
import {DataSourceRequestModel} from '../../../shared/data-source/models/data-source-request.model';
import {CurrencyEntity} from '../../../dao/currency/currency.entity';
import {DataSourceResponseModel} from '../../../shared/data-source/models/data-source-response.model';
import {DataSource} from '../../../shared/data-source/data-source';
import {RepositoryDataSource} from '../../../shared/data-source/impl/repository-data-source';

@Controller('/currency')
export class CurrencyController {

    private restDataSource: DataSource<CurrencyEntity>;

    constructor() {
        this.restDataSource = new RepositoryDataSource(getCustomRepository(CurrencyRepository));
    }

    @Post('/get')
    getItems(@BodyParams() request: DataSourceRequestModel<CurrencyEntity>): Promise<DataSourceResponseModel<CurrencyEntity>> {
        return this.restDataSource.getData(request);
    }

}
