import * as requestPromise from 'request-promise';
import {PaymentService} from '../../payment-service';
import {QiwiAccountModel} from './models/QiwiAccountModel';
import {QiwiTransferRequestModel} from './models/QiwiTransferRequestModel';
import {QiwiTransferResultModel} from './models/QiwiTransferResultModel';
import {QiwiProviderEnum} from './enums/QiwiProviderEnum';
import {QiwiTransactionInfoModel} from './models/QiwiTransactionInfoModel';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
import {QiwiTransactionStatusEnum} from './enums/QiwiTransactionStatusEnum';
import {QiwiTransactionRequestFilterModel} from './models/QiwiTransactionRequestFilterModel';
import {getCustomRepository} from 'typeorm';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import {QiwiTransactionTypeEnum} from './enums/QiwiTransactionTypeEnum';
import {QiwiTransactionSourceEnum} from './enums/QiwiTransactionSourceEnum';
import {Service} from '@tsed/common';
import {CurrencyService} from '../../../currency.service';
import {CurrencyRepository} from '../../../../../dao/currency/currency.repository';
import {delay} from '../../../../../functions/delay';

const API_URL = 'https://edge.qiwi.com';

@Service()
export class QiwiPaymentService implements PaymentService {

    constructor(private currencyService: CurrencyService) {
    }

    private static async _createQiwiRequest(request: PaymentServiceTransferRequestModel): Promise<QiwiTransferRequestModel> {
        const currencyRep = getCustomRepository(CurrencyRepository);
        const currency = await currencyRep.findOne({where: {code: request.currencyCode}});

        return <QiwiTransferRequestModel>{
            id: Date.now() + '',
            sum: {
                amount: request.sourceSum,
                currency: currency.iso4217_num3 + ''
            },
            paymentMethod: {
                'type': 'Account',
                'accountId': currency.iso4217_num3 + ''
            },
            comment: request.comment,
            fields: {
                account: request.targetRequisite
            }
        };
    }

    private static async _getAccounts(token: string): Promise<{ accounts: QiwiAccountModel[] }> {
        return QiwiPaymentService._request('GET', `${API_URL}/funding-sources/v1/accounts/current`, token);
    }

    private static async _transfer(token: string, provider: QiwiProviderEnum | number, request: QiwiTransferRequestModel): Promise<QiwiTransferResultModel> {
        return QiwiPaymentService._request('POST', `${API_URL}/sinap/api/v2/terms/${provider}/payments`, token, null, request);
    }

    private static async _getTransactionInfo(token: string, transactionId: string): Promise<QiwiTransactionInfoModel> {
        return QiwiPaymentService._request('GET', `${API_URL}/payment-history/v2/transactions/${transactionId}`, token);
    }

    private static async _getTransactions(token: string, requisite: string, filter: QiwiTransactionRequestFilterModel): Promise<QiwiTransactionInfoModel[]> {
        const wallet = requisite.replace(/^\+/, '');
        const result = await QiwiPaymentService._request('GET', `${API_URL}/payment-history/v2/persons/${wallet}/payments`, token, filter);
        return result && result.data;
    }

    private static async _request(method: string, url: string, token: string, params: any = null, body: any = null): Promise<any> {
        return requestPromise({
            method: method,
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body,
            qs: params,
            json: true
        });
    }

    async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
        const result = await QiwiPaymentService._getAccounts(account.password);

        const balances: PaymentServiceBalanceModel[] = [];
        for (let i = 0; i < result.accounts.length; i++) {
            const acc = result.accounts[i];

            if (!acc.hasBalance) {
                continue;
            }

            balances.push({
                amount: acc.balance.amount,
                currencyCode: await this.currencyService.getCodeByIso4217Num3(+acc.balance.currency)
            });
        }

        return balances;
    }

    async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return account.login;
    }

    async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return account.login;
    }

    async getReceiveTransfers(account: PaymentServiceAccountModel, requisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        const transfers = await QiwiPaymentService._getTransactions(account.password, requisite, {
            startDate: fromDate.toISOString(),
            endDate: toDate.toISOString(),
            rows: 10,
            operation: QiwiTransactionTypeEnum.IN,
            sources: [QiwiTransactionSourceEnum['QW_' + currencyCode]]
        });

        return transfers.map(tr => <PaymentServiceTransferResultModel>{
            sourceSum: tr.sum.amount,
            targetSum: tr.total.amount,
            currencyCode: currencyCode
        });
    }

    async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
        const targetStatuses = [QiwiTransactionStatusEnum.SUCCESS, QiwiTransactionStatusEnum.ERROR];
        const token = request.sourceAccount.password;
        const provider = QiwiProviderEnum.QiwiWallet;

        const result: PaymentServiceTransferResultModel = {
            sourceSum: request.sourceSum,
            currencyCode: request.currencyCode,
            targetSum: request.sourceSum
        };

        const qiwiTransferRequest = await QiwiPaymentService._createQiwiRequest(request);
        console.log(`transfer ${request.sourceSum} ${result.currencyCode} ${qiwiTransferRequest.fields.account}`);
        const transferResult = await QiwiPaymentService._transfer(token, provider, qiwiTransferRequest);

        let transferInfo: QiwiTransactionInfoModel;
        do {
            await delay(5000);
            console.log(`getTransactionInfo ${transferResult.transaction.id}`);

            transferInfo = await QiwiPaymentService._getTransactionInfo(token, transferResult.transaction.id);
        } while (!targetStatuses.includes(transferInfo.status));

        if (transferInfo.status === QiwiTransactionStatusEnum.ERROR) {
            throw transferInfo.error || 'Перевод завершился ошибкой';
        }

        return result;
    }
}
