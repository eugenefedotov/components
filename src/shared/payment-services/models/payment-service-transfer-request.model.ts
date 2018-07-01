import {PaymentServiceAccountModel} from "./payment-service-account.model";

/**
 * Запрос перевода средств из платежного сервиса
 */
export interface PaymentServiceTransferRequestModel {
  /**
   * Код валюты.
   * предполагается, что валюта списания и зачисления всегда совпадают
   */
  currencyCode: string;

  /**
   * Аккаунт - источник
   */
  sourceAccount: PaymentServiceAccountModel;

  /**
   * сумма списания
   */
  sourceSum: number;

  /**
   * платежный реквизит получателя
   */
  targetRequisite: string;

  /**
   * коммент
   */
  comment?: string;
}
