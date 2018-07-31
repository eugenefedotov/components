import {QiwiTransactionTypeEnum} from '../enums/QiwiTransactionTypeEnum';
import {QiwiTransactionSourceEnum} from '../enums/QiwiTransactionSourceEnum';

/**
 * https://developer.qiwi.com/ru/qiwi-wallet-personal/#section
 */
export interface QiwiTransactionRequestFilterModel {
  rows: number; // Число платежей в ответе, для разбивки отчета на части. Целое число от 1 до 50. Обязательный параметр
  operation?: QiwiTransactionTypeEnum, // Тип операций в отчете, для отбора. Допустимые значения:
  sources?: QiwiTransactionSourceEnum[], // Источники платежа, для отбора.
  startDate?: string; // Начальная дата поиска платежей. Дату можно указать в любой временной зоне TZD (формат ГГГГ-ММ-ДД'T'чч:мм:ссTZD), однако она должна совпадать с временной зоной в параметре endDate. Обозначение временной зоны TZD: +чч:мм или -чч:мм (временной сдвиг от GMT). Используется только вместе с endDate. По умолчанию, равна суточному сдвигу от текущей даты по московскому времени.
  endDate?: string; // Конечная дата поиска платежей. Дату можно указать в любой временной зоне TZD (формат ГГГГ-ММ-ДД'T'чч:мм:ссTZD), однако она должна совпадать с временной зоной в параметре startDate. Обозначение временной зоны TZD: +чч:мм или -чч:мм (временной сдвиг от GMT). Используется только вместе с startDate. По умолчанию, равна текущим дате/времени по московскому времени.
  nextTxnDate?: string; // Дата транзакции для отсчета от предыдущего списка (равна параметру nextTxnDate в предыдущем списке). Используется только вместе с nextTxnId
  nextTxnId?: number; // Номер предшествующей транзакции для отсчета от предыдущего списка (равен параметру nextTxnId в предыдущем списке). Используется только вместе с nextTxnDate
}
