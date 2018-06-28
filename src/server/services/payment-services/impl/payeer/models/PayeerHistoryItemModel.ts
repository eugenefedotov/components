export interface PayeerHistoryItemModel {
  id: number;
  date: string; // 2016-03-02 15:35:17
  type: 'transfer' | 'deposit' | 'withdrawal' | 'sci'; // 	transfer - перевод deposit - пополнение  withdrawal - вывод sci - оплата в магазин
  status: 'success' | 'processing' | 'canceled' | 'waiting' | 'pending';
  from: string;

  debitedAmount: number; // сумма списания
  debitedCurrency: string; // 	валюта списания	USD, EUR, RUB
  to: string; //	номер счета получателя	P1000001, @sms, null

  creditedAmount: number; // сумма получения
  creditedCurrency: string; // валюта получения

  payeerFee: number; // комиссия Payeer
  gateFee: number; // комиссия шлюза

  comment: string; // комметарий

  paySystem: string; // 	наименование платежного метода	Payeer

  shopId: number; // id магазина, по которому произошло зачисление

  shopOrderId: number; // 	id номера счета в системе учета продавца

  exchangeRate: number; // курс конвертации

  protect: 'Y' | 'N'; // протекция сделки

  protectDay: number; // количество дней протекции сделки	1-30, null

  isApi: 'Y' | 'N'; // операция совершена через API	Y, N

  shop: any[];

}
