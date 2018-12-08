import {BitcoinCorePaymentService} from '../bitcoin-core/BitcoinCorePaymentService';
import {Service} from '@tsed/common';

@Service()
export class LitecoinCorePaymentService extends BitcoinCorePaymentService {
    constructor() {
        super();
        this.host = 'des-pc';
        this.port = 9432;
        this.currencyCode = 'LTC';
    }
}
