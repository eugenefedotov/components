import {QiwiTransactionTypeEnum} from '../enums/QiwiTransactionTypeEnum';
import {QiwiTransactionStatusEnum} from '../enums/QiwiTransactionStatusEnum';
import {QiwiProviderInfoModel} from './QiwiProviderInfoModel';
import {QiwiSumWithCurrencyModel} from './QiwiSumWithCurrencyModel';

export interface QiwiTransactionInfoModel {
  'txnId': number, // ID транзакции в процессинге QIWI Wallet
  'personId': number, // Номер кошелька
  'date': string, // Дата/время платежа, во временной зоне запроса (см. параметр startDate). Формат даты ГГГГ-ММ-ДД'T'чч:мм:сс+03:00
  'errorCode': number, // Код ошибки платежа
  'error': string, // Описание ошибки
  'status': QiwiTransactionStatusEnum,
  'type': QiwiTransactionTypeEnum, // Тип платежа.
  'statusText': string, // "Запрос обрабатывается",
  'trmTxnId': string, // Клиентский ID транзакции
  'account': string, // Номер счета получателя
  'sum': QiwiSumWithCurrencyModel, // Данные о сумме платежа.
  'commission': QiwiSumWithCurrencyModel, // Данные о комиссии платежа.
  'total': QiwiSumWithCurrencyModel, // Данные об общей сумме платежа.
  'provider': QiwiProviderInfoModel, // Данные о провайдере.
  'source': QiwiProviderInfoModel,
  'comment': string,
  'currencyRate': number, // Курс конвертации (если применяется в транзакции)
  'extras': any[], // Служебная информация
  'chequeReady': boolean,
  'bankDocumentAvailable': boolean,
  'bankDocumentReady': boolean,
  'repeatPaymentEnabled': boolean,
  'favoritePaymentEnabled': boolean,
  'regularPaymentEnabled': boolean,
  nextTxnId: number, // ID следующей транзакции в полном списке,
  nextTxnDate: string, // Дата/время следующей транзакции в полном списке, время московское (в формате ГГГГ-ММ-ДД'T'чч:мм:сс+03:00)
}
