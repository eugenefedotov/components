import {IPaymentServiceService} from '../../IPaymentServiceService';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {Service} from 'typedi';
import {TestPaymentServiceTransferEntity} from '../../../../../../../exchanger/core/dao/entities/TestPaymentServiceTransferEntity';
import {TestPaymentServiceRequisiteEntity} from '../../../../../../../exchanger/core/dao/entities/TestPaymentServiceRequisiteEntity';
import {PaymentServiceCurrencyRepository} from '../../../../../../../exchanger/core/dao/repositories/PaymentServiceCurrencyRepository';
import {round} from '../../../../../../../exchanger/core/functions/round';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {TestPaymentServiceRequisiteRepository} from '../../../../../../../exchanger/core/dao/repositories/TestPaymentServiceRequisiteRepository';
import {TestPaymentServiceTransferRepository} from '../../../../../../../exchanger/core/dao/repositories/TestPaymentServiceTransferRepository';

@Service('payment-service.TEST')
export class TestPaymentService implements IPaymentServiceService {

  constructor(@OrmRepository() private paymentServiceCurrencyRepository: PaymentServiceCurrencyRepository,
              @OrmRepository() private testPaymentServiceRequisiteRepository: TestPaymentServiceRequisiteRepository,
              @OrmRepository() private testPaymentServiceTransferRepository: TestPaymentServiceTransferRepository) {
  }


  async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {

    const paymentServiceTransferResultModel: PaymentServiceTransferResultModel = {
      currencyCode: request.currencyCode,
      sourceSum: request.sourceSum,
      targetSum: request.sourceSum
    };

    let transfer = new TestPaymentServiceTransferEntity();
    transfer.currencyCode = request.currencyCode;
    transfer.sourceAccountLogin = request.sourceAccount.login;
    transfer.sourceSum = request.sourceSum;
    transfer.targetRequisite = request.targetRequisite;

    let sourceRequisite = await this.testPaymentServiceRequisiteRepository.getByLoginAndCurrencyCode(transfer.sourceAccountLogin, transfer.currencyCode);

    if (!sourceRequisite) {
      throw new Error(`TEST doTransfer sourceRequisite "${transfer.sourceAccountLogin} ${transfer.currencyCode}" not found`);
    }

    const paymentServiceCurrencyEntity = await this.paymentServiceCurrencyRepository.findOne(sourceRequisite.paymentServiceCurrency.id);
    transfer.targetSum = paymentServiceCurrencyEntity.calculateTargetSum(transfer.sourceSum);
    transfer = await this.testPaymentServiceTransferRepository.save(transfer);
    paymentServiceTransferResultModel.targetSum = transfer.targetSum;

    if (!transfer.targetSum) {
      throw new Error(`Не удалось посчитать сумму с комиссией от ${transfer.sourceSum} ${transfer.currencyCode}`);
    }

    if (sourceRequisite.amount < request.sourceSum) {
      throw new Error(`Недостаточно средств. ${sourceRequisite.amount} < ${request.sourceSum}`);
    }

    let targetRequisite = await this.testPaymentServiceRequisiteRepository.getByRequisiteAndCurrencyCode(transfer.targetRequisite, transfer.currencyCode);

    if (!targetRequisite) {
      throw new Error(`TEST doTransfer targetRequisite "${request.targetRequisite}" not found`);
    }

    await this.testPaymentServiceRequisiteRepository.update(sourceRequisite.id, {amount: sourceRequisite.amount - request.sourceSum});

    // нужны актуальные данные
    targetRequisite = await this.testPaymentServiceRequisiteRepository.findOne(targetRequisite.id);
    await this.testPaymentServiceRequisiteRepository.update(targetRequisite.id, {amount: targetRequisite.amount + request.sourceSum});

    return paymentServiceTransferResultModel;
  }

  async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
    const requisites = await this.getRequisites(account);

    return requisites.map(requisite => (<PaymentServiceBalanceModel>{
      amount: requisite.amount,
      currencyCode: requisite.paymentServiceCurrency.currency.code
    }));
  }

  async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
    const requisites = await this.getRequisites(account);

    const requisite = requisites.find(value => value.paymentServiceCurrency.currency.code === currencyCode);

    if (!requisite) {
      return;
    }

    return requisite.requisite;
  }

  async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
    const requisites = await this.getRequisites(account);

    const requisite = requisites.find(value => value.paymentServiceCurrency.currency.code === currencyCode);

    if (!requisite) {
      return;
    }

    return requisite.requisite;
  }

  async getReceiveTransfers(account: PaymentServiceAccountModel, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
    const transactions = await this.testPaymentServiceTransferRepository.getReceiveTransfers(account, targetRequisite, currencyCode, fromDate, toDate);

    console.log(`Кол-во транзакций найдено: ${transactions.length}`);

    return transactions.map(tr => <PaymentServiceTransferResultModel>{
      currencyCode: tr.currencyCode,
      sourceSum: tr.sourceSum,
      targetSum: tr.targetSum
    });
  }

  private async getRequisites(account: PaymentServiceAccountModel): Promise<TestPaymentServiceRequisiteEntity[]> {
    return this.testPaymentServiceRequisiteRepository.getByLoginAndPaymentServiceCode(account.login, 'TEST');
  }

}
