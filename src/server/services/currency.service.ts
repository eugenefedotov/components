import {getCustomRepository} from 'typeorm';
import {CurrencyRepository} from '../../dao/currency/currency.repository';
import {Service} from '@tsed/common';

@Service()
export class CurrencyService {

    async getCodeByIso4217Num3(currencyNum: number): Promise<string> {
        const currencyRep = getCustomRepository(CurrencyRepository);

        const currency = await currencyRep.findOne({
            where: {
                iso4217_num3: currencyNum
            }
        });

        return currency ? currency.code : null;
    }

    getCurrencyCode(currencyName: string): string {
        switch (currencyName.substring(0, 1)) {
            case 'U':
                return 'USD';
            case 'E':
                return 'EUR';
            case 'G':
                return 'GOLD';
            case 'R':
                return 'RUB';
            case 'B':
                return 'BTC';
        }
    }
}
