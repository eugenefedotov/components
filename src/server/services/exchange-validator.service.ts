import {Service} from '@tsed/common';
import {ExchangeEntity} from '../../dao/exchange/exchange.entity';
import {getCustomRepository} from 'typeorm';
import {ExchangeRepository} from '../../dao/exchange/exchange.repository';
import {MaskRepository} from '../../dao/mask/mask.repository';
import {PaymentServiceRequisiteTypeRepository} from '../../dao/payment-service-requisite-type/payment-service-requisite-type.repository';

@Service()
export class ExchangeValidatorService {

    private exchangeRepository = getCustomRepository(ExchangeRepository);
    private maskRepository = getCustomRepository(MaskRepository);
    private paymentServiceRequisiteTypeRepository = getCustomRepository(PaymentServiceRequisiteTypeRepository);

    async isValid(exchange: ExchangeEntity): Promise<boolean> {
        exchange = await this.exchangeRepository.preload(exchange);
        const paymentServiceRequisiteType = await this.paymentServiceRequisiteTypeRepository.preload(exchange.toRequisiteType);
        return paymentServiceRequisiteType.mask.isValidAndComplete(exchange.toRequisiteValue);
    }

}
