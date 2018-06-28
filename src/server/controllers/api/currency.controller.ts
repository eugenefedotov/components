import {BodyParams, Controller, Post} from '@tsed/common';
import {getCustomRepository} from 'typeorm';
import {CurrencyRepository} from '../../../dao/currency/currency.repository';
import {RestDataRequestModel} from '../../../shared/rest-data/models/rest-data-request.model';
import {CurrencyEntity} from '../../../dao/currency/currency.entity';
import {RestDataResponseModel} from '../../../shared/rest-data/models/rest-data-response.model';
import {RestDataSource} from '../../../shared/rest-data/rest-data-source';
import {RepositoryRestDataSource} from '../../../shared/rest-data/impl/repository-rest-data-source';

@Controller('/currency')
export class CurrencyController {

    private restDataSource: RestDataSource<CurrencyEntity>;

    constructor() {
        this.restDataSource = new RepositoryRestDataSource(getCustomRepository(CurrencyRepository));
    }

    @Post('/get')
    getItems(@BodyParams() request: RestDataRequestModel<CurrencyEntity>): Promise<RestDataResponseModel<CurrencyEntity>> {
        return this.restDataSource.getResult(request);
    }

}
