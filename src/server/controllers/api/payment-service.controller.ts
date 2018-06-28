import {BodyParams, Controller, Post} from '@tsed/common';
import {RestDataResponseModel} from '../../../shared/rest-data/models/rest-data-response.model';
import {RepositoryRestDataSource} from '../../../shared/rest-data/impl/repository-rest-data-source';
import {getCustomRepository} from 'typeorm';
import {RestDataRequestModel} from '../../../shared/rest-data/models/rest-data-request.model';
import {RestDataSource} from '../../../shared/rest-data/rest-data-source';
import {PaymentServiceEntity} from '../../../dao/payment-service/payment-service.entity';
import {PaymentServiceRepository} from '../../../dao/payment-service/payment-service.repository';

@Controller('/payment-service')
export class PaymentServiceController {

    private restDataSource: RestDataSource<PaymentServiceEntity>;

    constructor() {
        this.restDataSource = new RepositoryRestDataSource(getCustomRepository(PaymentServiceRepository));
    }

    @Post('/get')
    getItems(@BodyParams() request: RestDataRequestModel<PaymentServiceEntity>): Promise<RestDataResponseModel<PaymentServiceEntity>> {
        return this.restDataSource.getResult(request);
    }
}
