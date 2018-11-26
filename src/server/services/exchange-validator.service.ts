import {Service} from '@tsed/common';
import {ExchangeEntity} from '../../dao/exchange/exchange.entity';

@Service()
export class ExchangeValidatorService {

    async isValid(exchange: ExchangeEntity): Promise<boolean> {
        return true;
    }

}
