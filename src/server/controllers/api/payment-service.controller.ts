import {BodyParams, Controller, Post} from '@tsed/common';
import {DataSourceResponseModel} from '../../../shared/data-source/models/data-source-response.model';
import {RepositoryDataSource} from '../../../shared/data-source/impl/repository-data-source';
import {getCustomRepository} from 'typeorm';
import {DataSourceRequestModel} from '../../../shared/data-source/models/data-source-request.model';
import {DataSource} from '../../../shared/data-source/data-source';
import {PaymentServiceEntity} from '../../../dao/payment-service/payment-service.entity';
import {PaymentServiceRepository} from '../../../dao/payment-service/payment-service.repository';

@Controller('/payment-service')
export class PaymentServiceController {

    private restDataSource: DataSource<PaymentServiceEntity>;

    constructor() {
        this.restDataSource = new RepositoryDataSource(getCustomRepository(PaymentServiceRepository));
    }

    @Post('/get')
    getItems(@BodyParams() request: DataSourceRequestModel<PaymentServiceEntity>): Promise<DataSourceResponseModel<PaymentServiceEntity>> {
        return this.restDataSource.getData(request);
    }
}
