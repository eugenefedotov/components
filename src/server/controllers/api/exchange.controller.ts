import {Controller, Get, PathParams} from '@tsed/common';
import {ExchangeEntity} from '../../../dao/exchange/exchange.entity';
import {getCustomRepository} from 'typeorm';
import {ExchangeRepository} from '../../../dao/exchange/exchange.repository';


@Controller('/exchange')
export class ExchangeController {

    private exchangeRepository = getCustomRepository(ExchangeRepository);

    @Get('/:uuid')
    getData(@PathParams('uuid') uuid: string): Promise<ExchangeEntity> {
        return this.exchangeRepository.findOne(uuid);
    }
}
