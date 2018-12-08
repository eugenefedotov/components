import * as requestPromise from 'request-promise';
import {PaymentService} from '../../payment-service';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
import {Service} from '@tsed/common';
import {CurrencyService} from '../../../currency.service';


export interface PerfectMoneyResponseModel {
}

@Service()
export class PerfectMoneyPaymentService implements PaymentService {
    API_URL = 'https://perfectmoney.is/acct';

    constructor(private currencyService: CurrencyService) {
    }

    async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
        const response = await this.request(account, 'balance');
        const balance = this.parsePerfectMoneyResponse(response);

        return Object.keys(balance).map(accountName => <PaymentServiceBalanceModel>{
            currencyCode: this.currencyService.getCurrencyCode(accountName),
            amount: parseFloat(balance[accountName])
        });
    }

    async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        const response = await this.request(account, 'balance');
        const balance = this.parsePerfectMoneyResponse(response);
        const receiveRequisite = Object.keys(balance).filter(accountName => {
            if (accountName.substring(0, 1) === currencyCode.substring(0, 1)) {
                return balance[accountName];
            }
        });
        return receiveRequisite[0];
    }

    async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        const response = await this.request(account, 'balance');
        const balance = this.parsePerfectMoneyResponse(response);
        const receiveRequisite = Object.keys(balance).filter(accountName => {
            if (accountName.substring(0, 1) === currencyCode.substring(0, 1)) {
                return balance[accountName];
            }
        });
        return receiveRequisite[0];
    }

    async getReceiveTransfers(account: PaymentServiceAccountModel, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        const result: PaymentServiceTransferResultModel[] = [];

        const response = await this.request(account, 'historycsv', {
            startday: fromDate.getDate(),
            startmonth: fromDate.getMonth() + 1,
            startyear: fromDate.getFullYear(),
            endday: toDate.getDate(),
            endmonth: toDate.getMonth() + 1,
            endyear: toDate.getFullYear(),
        });
        const lines = response.split(/\n/);
        if (lines.length < 2) {
            throw new Error(`Нет данных`);
        }

        const fields = lines[0].split(/,/);
        const typeColumnIndex = fields.indexOf('Type');
        const currencyColumnIndex = fields.indexOf('Currency');
        const amountColumnIndex = fields.indexOf('Amount');

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/,/);
            if (values.length !== fields.length) {
                continue;
            }

            if (values[typeColumnIndex] === 'Income' && values[currencyColumnIndex] === currencyCode) {
                const val: PaymentServiceTransferResultModel = {
                    currencyCode: values[currencyColumnIndex],
                    sourceSum: 0,
                    targetSum: parseFloat(values[amountColumnIndex])
                };
                result.push(val);
            }
        }

        return result;
    }

    async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
        const sender = await this.getReceiveRequisite(request.sourceAccount, request.currencyCode);

        const response = await this.request(request.sourceAccount, 'confirm', {
            Payer_Account: sender,
            Payee_Account: request.targetRequisite,
            Amount: request.sourceSum,
            Memo: request.comment,
        });

        const transferResult = this.parsePerfectMoneyResponse(response);
        if (transferResult['ERROR']) {
            throw new Error(`При переводе средств возникла ошибка:  ${transferResult['ERROR']}`);
        }

        return {
            currencyCode: this.currencyService.getCurrencyCode(transferResult['Payer_Account']),
            sourceSum: 0,
            targetSum: transferResult['PAYMENT_AMOUNT']
        };
    }

    parsePerfectMoneyResponse(response: string): PerfectMoneyResponseModel {
        const resposeResult: PerfectMoneyResponseModel = {};
        const regexp = /<input name='(.*)' type='hidden' value='(.*)'>/ig;
        let result = regexp.exec(response);

        while (result) {
            resposeResult[result[1]] = result[2];
            result = regexp.exec(response);
        }

        return resposeResult;
    }

    async request(account: PaymentServiceAccountModel, action: string, params?: any): Promise<string> {
        params = {
            ...params,
            ...{
                AccountID: account.login,
                PassPhrase: account.password
            }
        };

        const response = await requestPromise.post(`${this.API_URL}/${action}.asp`, {
            form: params,
            json: true
        });

        return response;
    }
}
