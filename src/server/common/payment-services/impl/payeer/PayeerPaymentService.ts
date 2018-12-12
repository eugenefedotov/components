import {PaymentService} from '../../payment-service';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import * as requestPromise from 'request-promise';
import {PayeerBaseResponseModel} from './models/PayeerBaseResponseModel';
import {PayeerBalanceResponseModel} from './models/PayeerBalanceResponseModel';
import {PayeerHistoryItemModel} from './models/PayeerHistoryItemModel';
import * as moment from 'moment';
import {PayeerTransferRequestParamsModel} from './models/PayeerTransferRequestParamsModel';
import {PayeerOutputParamsResponseModel} from './models/PayeerOutputParamsResponseModel';
import {PayeerHistoryInfoModel} from './models/PayeerHistoryInfoModel';

const PAYEER_API_URL = 'https://payeer.com/ajax/api/api.php';

/**
 * https://payeerru.docs.apiary.io/#reference/0
 */
export class PayeerPaymentService implements PaymentService {
    async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {

        const payeerRequest: PayeerTransferRequestParamsModel = {
            curIn: request.currencyCode,
            sum: request.sourceSum,
            curOut: request.currencyCode,
            to: request.targetRequisite,
            comment: request.comment
        };
        const response = await this.request<PayeerOutputParamsResponseModel>(request.sourceAccount, 'transfer', payeerRequest);

        if (!response || !response.historyId) {
            throw new Error(`При переводе средств возникла ошибка`);
        }

        const history = await this.requestHistoryById(request.sourceAccount, response.historyId);

        if (!history.info) {
            throw new Error(`Не удалось получить информацию о совершенной транзакции`);
        }
        const historyInfo = history.info;

        return {
            currencyCode: historyInfo.curIn,
            sourceSum: parseFloat(historyInfo.sumIn),
            targetSum: parseFloat(historyInfo.sumOut)
        };
    }

    async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
        const balance = await this.request<PayeerBalanceResponseModel>(account, 'balance');

        return Object.keys(balance.balance).map(currencyCode => <PaymentServiceBalanceModel>{
            currencyCode: currencyCode,
            amount: parseFloat(balance.balance[currencyCode].BUDGET)
        });
    }

    async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return account.login;
    }

    async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return account.login;
    }

    async getReceiveTransfers(account: PaymentServiceAccountModel, requisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        const fromMSK = moment.utc(fromDate).add(3, 'hours').format('YYYY-MM-DD HH:m:s');
        const toMSK = moment.utc(toDate).add(3, 'hours').format('YYYY-MM-DD HH:m:s');

        const history = await this.requestHistory(account, fromMSK, toMSK);

        return history
            .filter(hi => hi.to === account.login)
            .filter(hi => hi.creditedCurrency === currencyCode)
            .filter(hi => hi.status === 'success')
            .map(hi => <PaymentServiceTransferResultModel>{
                currencyCode: hi.creditedCurrency,
                sourceSum: hi.debitedAmount,
                targetSum: hi.creditedAmount
            });
    }

    async requestHistoryById(account: PaymentServiceAccountModel, historyId: number): Promise<PayeerHistoryInfoModel> {
        return this.request<PayeerHistoryInfoModel>(account, 'historyInfo', {historyId});
    }

    async requestHistory(account: PaymentServiceAccountModel, fromDate: string, toDate: string): Promise<PayeerHistoryItemModel[]> {
        const history = await this.request<PayeerBaseResponseModel & { history: { [key: number]: PayeerHistoryItemModel } }>(account, 'history', {
            from: fromDate,
            to: toDate
        });
        return Object.keys(history.history).map(key => history.history[key]);
    }

    async request<T extends PayeerBaseResponseModel>(account: PaymentServiceAccountModel, action: string, params?: any): Promise<T> {
        const [apiId, apiPass] = account.password.split(':');
        params = {
            ...params,
            ...{
                action,
                account: account.login,
                apiId,
                apiPass
            }
        };

        const response: T = await requestPromise.post(PAYEER_API_URL, {
            qs: [params.action],
            form: params,
            json: true
        });

        if (!response || response.auth_error === '1') {
            throw new Error(response.errors[0] || 'Auth error');
        }

        return response;
    }
}
