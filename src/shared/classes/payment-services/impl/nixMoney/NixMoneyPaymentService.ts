// import * as requestPromise from 'request-promise';
// import {PaymentService} from '../../payment-service';
// import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
// import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
// import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
// import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
// import {CurrencyService} from '../../../../../../../exchanger/core/services/CurrencyService';
// import {Service} from 'typedi';
//
// export interface NixMoneyResponseModel {
// }
//
// @Service('payment-service.NIX')
// export class NixMoneyPaymentService implements PaymentService {
//   API_URL: string = 'http://dev.nixmoney.com/'; //https://www.nixmoney.com/
//
//   constructor(private currencyService: CurrencyService) {
//   }
//
//   async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
//     const response = await this.request(account, 'balance');
//     const balance = this.parseNixMoneyResponse(response);
//
//     return Object.keys(balance).map(accountName => <PaymentServiceBalanceModel>{
//       currencyCode: this.currencyService.getCurrencyCode(accountName),
//       amount: parseFloat(balance[accountName])
//     });
//   }
//
//   async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
//     // почему то апи возвращает другой номер кошелька. Но на dev работает. Не понятно будет ли работать на реальных кашельках
//     //return await this.request(account, 'resolve', {TYPE: currencyCode, resolve: account.login});
//
//     const response = await this.request(account, 'balance');
//     const balance = this.parseNixMoneyResponse(response);
//     let receiveRequisite = Object.keys(balance).filter(accountName => {
//       if (accountName.substring(0, 1) == currencyCode.substring(0, 1)) {
//         return balance[accountName];
//       }
//     });
//     return receiveRequisite[0];
//   }
//
//   async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
//     // почему то апи возвращает другой номер кошелька. Но на dev работает. Не понятно будет ли работать на реальных кашельках
//     //return await this.request(account, 'resolve', {TYPE: currencyCode, resolve: account.login});
//
//     const response = await this.request(account, 'balance');
//     const balance = this.parseNixMoneyResponse(response);
//     let receiveRequisite = Object.keys(balance).filter(accountName => {
//       if (accountName.substring(0, 1) == currencyCode.substring(0, 1)) {
//         return balance[accountName];
//       }
//     });
//     return receiveRequisite[0];
//   }
//
//   async getReceiveTransfers(account: PaymentServiceAccountModel, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
//     let result: PaymentServiceTransferResultModel[] = [];
//
//     const response = await this.request(account, 'history', {
//       startday: fromDate.getDate(),
//       startmonth: fromDate.getMonth() + 1,
//       startyear: fromDate.getFullYear(),
//       endday: toDate.getDate(),
//       endmonth: toDate.getMonth() + 1,
//       endyear: toDate.getFullYear(),
//       paymentsreceived:1,
//       metalfilter: currencyCode,
//       desc: 1
//     });
//     let lines = response.split(/\n/);
//     if (lines.length < 2) {
//       throw new Error(`Нет данных`);
//     }
//
//     let fields = lines[0].split(/,/);
//     let amountColumnIndex = fields.indexOf('Amount');
//
//     for (let i = 1; i < lines.length; i++) {
//       let values = lines[i].split(/,/);
//       if (values.length != fields.length) continue;
//
//     let val: PaymentServiceTransferResultModel = {
//         currencyCode: currencyCode,
//         sourceSum: 0,
//         targetSum: parseFloat(values[amountColumnIndex])
//     };
//
//     result.push(val);
//     }
//
//     return result;
//   }
//
//   async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
//     const sender = await this.getReceiveRequisite(request.sourceAccount, request.currencyCode);
//
//     const response = await this.request(request.sourceAccount, 'send', {
//       Payer_Account: sender,
//       Payee_Account: request.targetRequisite,
//       Amount: request.sourceSum,
//       Memo: request.comment,
//     });
//
//     const transferResult = this.parseNixMoneyResponse(response);
//     if (transferResult['ERROR']) {
//       throw new Error(`При переводе средств возникла ошибка:  ${transferResult['ERROR']}`);
//     }
//
//     return {
//       currencyCode: this.currencyService.getCurrencyCode(transferResult['PAYER_ACCOUNT']),
//       sourceSum: 0,
//       targetSum: transferResult['PAYMENT_AMOUNT']
//     };
//   }
//
//   parseNixMoneyResponse(response: string): NixMoneyResponseModel {
//     let resposeResult: NixMoneyResponseModel = {};
//     let regexp = /<input name='(.*)' type='hidden' value='(.*)'>/ig;
//     let result = regexp.exec(response);
//
//     while (result) {
//       resposeResult[result[1]] = result[2];
//       result = regexp.exec(response);
//     }
//
//     return resposeResult;
//   }
//
//   async request(account: PaymentServiceAccountModel, action: string, params?: any): Promise<string> {
//     params = {
//       ...params,
//       ...{
//         accountid: account.login,
//         passphrase: account.password
//       }
//     };
//
//     const response = await requestPromise.post(`${this.API_URL}/${action}`, {
//       form: params,
//       json: true
//     });
//
//     return response;
//   }
// }
