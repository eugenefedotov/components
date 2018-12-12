import {PaymentServiceAccountModel} from './models/payment-service-account.model';
import {PaymentServiceTransferResultModel} from './models/payment-service-transfer-result.model';
import {PaymentServiceTransferRequestModel} from './models/payment-service-transfer-request.model';
import {PaymentServiceBalanceModel} from './models/payment-service-balance.model';

/**
 * Интерфейс взаимодействия с платежным сервисом
 */
export interface PaymentService {

  /**
   * Получение платежного реквизита, с которого отправляются средства
   * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
   * @param {string} currencyCode Код валюты
   * @returns {Promise<string>}
   */
  getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string>;

  /**
   * Получение платежного реквизита, на который должны поступить средства
   * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
   * @param {string} currencyCode Код валюты зачисления
   * @returns {Promise<string>}
   */
  getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string>;

  /**
   * Получение списка транзакций
   * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
   * @param {string} targetRequisite Реквизит, на который должны были поступить средства
   * @param {string} currencyCode Код валюты зачисления
   * @param {Date} fromDate С
   * @param {Date} toDate По
   * @returns {Promise<PaymentServiceTransferResultModel[]>}
   */
  getReceiveTransfers(account: PaymentServiceAccountModel, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]>;

  /**
   * Получение информации о имеющихся средствах в различных валютах
   * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
   * @returns {Promise<PaymentServiceBalanceModel[]>}
   */
  getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]>;

  /**
   * Выполнение перевода средств
   * @param {PaymentServiceTransferRequestModel} request
   * @returns {Promise<PaymentServiceTransferResultModel>}
   */
  doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel>;
}
