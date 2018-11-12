import {BodyParams, Controller, Get, PathParams, Post} from '@tsed/common';
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

    @Post('')
    async initExchange(@BodyParams() exchangeParams: ExchangeEntity): Promise<ExchangeEntity> {
        const exchange = this.exchangeRepository.create(exchangeParams);
        return this.exchangeRepository.save(exchange);
    }
}
