import {QiwiSumWithCurrencyModel} from './QiwiSumWithCurrencyModel';

/**
 * id    String    Копия параметра id из исходного запроса
 terms    String    Константа, 99
 fields    Object    Копия объекта fields из исходного запроса.
 sum    Object    Копия объекта sum из исходного запроса.
 source    String    Константа, account_643
 comment    String    Копия параметра comment из исходного запроса (если присутствует в запросе)
 transaction    Object    Объект с данными о транзакции в процессинге QIWI Wallet. Параметры:
 transaction.id    String    ID транзакции в процессинге QIWI Wallet
 transaction.state    Object    Объект содержит текущее состояние транзакции в процессинге QIWI Wallet. Параметр:
 state.code    String    Текущий статус транзакции, только значение Accepted (платеж принят к проведению). Финальный результат транзакции можно узнать в истории платежей.
 */
export interface QiwiTransferResultModel {
  'id': string, // "150217833198900",
  'terms': string, // "99",
  'fields': {
    'account': string, // "79121238345"
  },
  'sum': QiwiSumWithCurrencyModel,
  'transaction': {
    'id': string, // "11155897070",
    'state': {
      'code': 'Accepted'
    }
  },
  'source': 'account_643',
  'comment': string; // "test"
}
