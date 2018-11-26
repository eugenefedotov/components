import {Service} from '@tsed/common';
import {ExchangeEntity} from '../../dao/exchange/exchange.entity';
import {getCustomRepository} from 'typeorm';
import {ExchangeRepository} from '../../dao/exchange/exchange.repository';

@Service()
export class ExchangeValidatorService {

    // private exchangeRepository = getCustomRepository(ExchangeRepository);

    async isValid(exchange: ExchangeEntity): Promise<boolean> {
        return exchange.toRequisiteType.mask.isValidAndComplete(exchange.toRequisiteValue);
    }

}
