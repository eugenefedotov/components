import {PaymentService} from '../../payment-service';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import Client from 'rpc-cli';
import {BitcoinWalletInfoModel} from './models/BitcoinWalletInfoModel';
import {getCustomRepository} from 'typeorm';
import {BitcoinTransactionInfoModel} from './models/BitcoinTransactionInfoModel';
import {PaymentServiceCurrencyEntity} from '../../../../../../../exchanger/core/dao/entities/PaymentServiceCurrencyEntity';
import {PaymentServiceCurrencyRepository} from '../../../../../../../exchanger/core/dao/repositories/PaymentServiceCurrencyRepository';
import {Service} from '@tsed/common';

@Service()
export class BitcoinCorePaymentService implements PaymentService {
  protected host = 'des-pc';
  protected port = 8332;
  protected currencyCode = 'BTC';

  constructor() {
  }

  async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
    const transactionId = await this.request(request.sourceAccount, 'sendtoaddress', [
      request.targetRequisite,
      request.sourceSum,
      request.comment,
      request.comment
    ]);

    const transactionInfo = await this.request<BitcoinTransactionInfoModel>(request.sourceAccount, 'gettransaction', [transactionId]);

    return {
      targetSum: request.sourceSum + transactionInfo.fee,
      sourceSum: request.sourceSum,
      currencyCode: request.currencyCode
    };
  }

  async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
    const walletInfo: BitcoinWalletInfoModel = await this.request(account, 'getwalletinfo');

    return [
      {
        amount: walletInfo.balance,
        currencyCode: this.currencyCode
      }
    ];
  }

  async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
    return null;
  }

  async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
    return this.request(account, 'getnewaddress');
  }

  async getReceiveTransfers(account: PaymentServiceAccountModel, requisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
    const paymentServiceCurrencyEntity = await this.getPaymentServiceCurrencyEntity();

    const targetSum: number = await this.request(account, 'getreceivedbyaddress', [requisite, 2]);
    const sourceSum = paymentServiceCurrencyEntity.calculateSourceSum(targetSum);

    return [
      {
        currencyCode,
        sourceSum,
        targetSum
      }
    ];
  }

  private async getPaymentServiceCurrencyEntity(): Promise<PaymentServiceCurrencyEntity> {
    const paymentServiceCurrencyRep = getCustomRepository(PaymentServiceCurrencyRepository);
    const paymentServiceCurrencyEntity = await paymentServiceCurrencyRep.findOne({
      where: {
        code: this.currencyCode // допущение. для криптовалют currency.code и paymentServiceCurrency.code эквивалентны
      }
    });

    if (!paymentServiceCurrencyEntity) {
      throw new Error(`paymentServiceCurrencyEntity ${this.currencyCode} not found`);
    }

    return paymentServiceCurrencyEntity;
  }

  private async request<T = any>(account: PaymentServiceAccountModel, method: string, params?: any): Promise<T> {
    const client = this.getRpcClient(account);
    return client.invoke(method, params) as Promise<T>;
  }

  private getRpcClient(account: PaymentServiceAccountModel): Client {
    return new Client({
      url: `http://${account.login}:${account.password}@${this.host}:${this.port}`
    });
  }

}
