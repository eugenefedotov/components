interface AdvCashHistoryReturnModel {
    id: string; // ID совершенной транзакции
    activityLevel: string; //
    amount: string; // Сумма транзакции 
    comment: string; // Примечание к транзакции
    currency: string; // Валюта перевода -  3 символа ISO 4217
    direction: string; // Принимает 2 значения «INCOMING» - входящий платеж  «OUTGOING» - исходящий платеж
    fullCommission: string;// Комиссия текущей транзакции
    receiverEmail: string; // Email получателя платежа
    sci: string; // Индикатор платежа, совершенного через  SCI
    senderEmail: string; // Email отправителя платежа
    startTime: string; // Дата создания транзакции (шаблон - yyyyMM-dd'T'HH:mm:ss'.'SZ)
    status: string; // Статус транзакции   
    transactionName: string; // Имя транзакции
    walletDestId: string; // Кошелек получателя платежа
    walletSrcId: string // Кошелек отправителя платежа
}

export class AdvCashHistoryModel {
    return: AdvCashHistoryReturnModel[]; 
}

export class AdvCashHistoryOneModel {
    return: AdvCashHistoryReturnModel; 
}