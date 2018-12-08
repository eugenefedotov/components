import * as soap from 'soap';
import * as moment from 'moment';
import {PaymentService} from '../../payment-service';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';
import {AdvCashBalanceItemModel} from './models/AdvCashBalanceItemModel';
import {AdvCashHistoryModel, AdvCashHistoryOneModel} from './models/AdvCashHistoryModel';
import {AdvCashTransactionModel} from './models/AdvCashTransactionModel';
import {Service} from '@tsed/common';
import {CurrencyService} from '../../../currency.service';
import {createHash} from '../../../../../functions/create-hash';

@Service()
export class AdvCashPaymentService implements PaymentService {
    API_URL = 'https://wallet.advcash.com/wsm/merchantWebService?wsdl';
    soapClient: soap.Client;

    constructor(private currencyService: CurrencyService) {
    }

    async getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
        if (this.soapClient == null) {
            this.soapClient = await this.createSoapClient();
        }

        const result = await this.request<AdvCashBalanceItemModel>(account, 'getBalancesAsync');

        return result.return.map(item => <PaymentServiceBalanceModel>{
            currencyCode: this.currencyService.getCurrencyCode(item.id),
            amount: parseFloat(item.amount)
        });
    }

    async getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return account.login;
    }

    async getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return account.login;
    }

    async getReceiveTransfers(account: PaymentServiceAccountModel, requisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        if (this.soapClient == null) {
            this.soapClient = await this.createSoapClient();
        }

        const params = {
            from: 0,
            count: 10,
            startTimeFrom: fromDate.toISOString(),
            startTimeTo: toDate.toISOString()
        };

        const result = await this.request<AdvCashHistoryModel>(account, 'historyAsync', params);

        return result.return
            .filter(hi => hi.receiverEmail === account.login)
            .filter(hi => hi.currency === (currencyCode === 'RUB' ? 'RUR' : currencyCode))  // TODO: Проблема с RUB тут он RUR (старый стандарт)
            .filter(hi => hi.status === 'COMPLETED')
            .filter(hi => hi.direction === 'INCOMING')
            .map(hi => <PaymentServiceTransferResultModel>{
                currencyCode: hi.currency,
                sourceSum: 0,
                targetSum: parseFloat(hi.amount)
            });
    }

    async doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
        if (this.soapClient == null) {
            this.soapClient = await this.createSoapClient();
        }

        const currencyCode = (request.currencyCode === 'RUB' ? 'RUR' : request.currencyCode);

        const params = {
            amount: request.sourceSum,
            currency: currencyCode,
            email: request.targetRequisite,
            note: request.comment
        };
        const result = await this.request<AdvCashTransactionModel>(request.sourceAccount, 'sendMoneyAsync', params);

        if (!result || !result.return) {
            throw new Error(`При переводе средств возникла ошибка`);
        }
        const transactionId = result.return;
        const transaction = await this.request<AdvCashHistoryOneModel>(request.sourceAccount, 'findTransactionAsync', transactionId);

        if (!transaction || !transaction.return) {
            throw new Error(`Не удалось получить информацию о совершенной транзакции`);
        }
        const transactionReturn = transaction.return;
        return {
            currencyCode: transactionReturn.currency,
            sourceSum: 0,
            targetSum: parseFloat(transactionReturn.amount)
        };
    }

    createToken(securityWord: string): string {
        const token = securityWord + ':' + moment().utc().format('YYYYMMDD:HH');
        return createHash(token, 'sha256');
    }

    private async request<T>(account: PaymentServiceAccountModel, method: string, params?: any): Promise<T> {
        const [apiName, securityWord] = account.password.split(':');
        const args = {
            accountEmail: account.login,
            apiName,
            authenticationToken: this.createToken(securityWord)
        };

        const soapMethod = this.soapClient[method] as soap.ISoapServiceMethod;
        const response: T = await soapMethod({arg0: args, arg1: params}, function () {
        });
        return response;
    }

    private async createSoapClient(): Promise<soap.Client> {
        // let options = {'request': request.defaults({'proxy': 'http://aleshin:aiSheeh6w@proxy.prognoz.ru:8080', 'timeout': 5000})};
        return await soap.createClientAsync(this.API_URL/*, options*/);
    }
}
