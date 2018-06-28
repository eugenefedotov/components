import {Service} from 'typedi';
import {BitcoinCorePaymentService} from '../bitcoin-core/BitcoinCorePaymentService';

@Service('payment-service.LTC')
export class LitecoinCorePaymentService extends BitcoinCorePaymentService {
  constructor() {
    super();
    this.host = 'des-pc';
    this.port = 9432;
    this.currencyCode = 'LTC';
  }
}
