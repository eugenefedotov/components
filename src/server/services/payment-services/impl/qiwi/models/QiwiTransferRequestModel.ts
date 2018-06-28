import {QiwiSumWithCurrencyModel} from './QiwiSumWithCurrencyModel';

/**
 * id    String    Клиентский ID транзакции (максимум 20 цифр). Должен быть уникальным для каждой транзакции и увеличиваться с каждой последующей транзакцией. Для выполнения этих требований рекомендуется задавать равным 1000*(Standard Unix time в секундах).
 sum    Object    Данные о сумме платежа:
 sum.amount    Number    Сумма (можно указать рубли и копейки, разделитель .). Положительное число, округленное до 2 знаков после десятичной точки. При большем числе знаков значение будет округлено до копеек в меньшую сторону.
 sum.currency    String    Валюта (только 643, рубли)
 paymentMethod    Object    Объект, определяющий обработку платежа процессингом QIWI Wallet. Содержит следующие параметры:
 paymentMethod.type    String    Константа, Account
 paymentMethod.accountId    String    Константа, 643.
 fields    Object    Реквизиты платежа. Содержит параметр:
 fields.account    String    Номер телефона получателя (с международным префиксом)
 comment    String    Комментарий к платежу. Необязательный параметр.
 */
export interface QiwiTransferRequestModel {
  'id': string, //"11111111111111",
  'sum': QiwiSumWithCurrencyModel,
  'paymentMethod': {
    'type': 'Account',
    'accountId': string, // "643"
  },
  'comment': string, // "test",
  'fields': {
    'account': string // "+79121112233"
  }
}
