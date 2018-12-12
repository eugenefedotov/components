import {Service} from '@tsed/common';
import {PaymentServiceAccountModel} from '../common/payment-services/models/payment-service-account.model';
import {PaymentServiceTransferResultModel} from '../common/payment-services/models/payment-service-transfer-result.model';
import {PaymentServiceBalanceModel} from '../common/payment-services/models/payment-service-balance.model';
import {PaymentServiceTransferRequestModel} from '../common/payment-services/models/payment-service-transfer-request.model';
import {getCustomRepository} from 'typeorm';
import {PaymentServiceRepository} from '../../dao/payment-service/payment-service.repository';
import {PaymentService} from '../common/payment-services/payment-service';

@Service()
export class PaymentServiceService {

    private paymentServiceRepository = getCustomRepository(PaymentServiceRepository);

    /**
     * Получение платежного реквизита, с которого отправляются средства
     * @param paymentServiceId
     * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
     * @param {string} currencyCode Код валюты
     * @returns {Promise<string>}
     */
    async getSourceRequisite(paymentServiceId: number, account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return (await this.getPaymentServiceImpl(paymentServiceId)).getSourceRequisite(account, currencyCode);
    }

    /**
     * Получение платежного реквизита, на который должны поступить средства
     * @param paymentServiceId
     * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
     * @param {string} currencyCode Код валюты зачисления
     * @returns {Promise<string>}
     */
    async getReceiveRequisite(paymentServiceId: number, account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return (await this.getPaymentServiceImpl(paymentServiceId)).getSourceRequisite(account, currencyCode);
    }

    /**
     * Получение списка транзакций
     * @param paymentServiceId
     * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
     * @param {string} targetRequisite Реквизит, на который должны были поступить средства
     * @param {string} currencyCode Код валюты зачисления
     * @param {Date} fromDate С
     * @param {Date} toDate По
     * @returns {Promise<PaymentServiceTransferResultModel[]>}
     */
    async getReceiveTransfers(paymentServiceId: number, account: PaymentServiceAccountModel, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        return (await this.getPaymentServiceImpl(paymentServiceId)).getReceiveTransfers(account, targetRequisite, currencyCode, fromDate, toDate);
    }

    /**
     * Получение информации о имеющихся средствах в различных валютах
     * @param paymentServiceId
     * @param {PaymentServiceAccountModel} account информация для авторизации в платежном сервисе
     * @returns {Promise<PaymentServiceBalanceModel[]>}
     */
    async getBalances(paymentServiceId: number, account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
        return (await this.getPaymentServiceImpl(paymentServiceId)).getBalances(account);
    }

    /**
     * Выполнение перевода средств
     * @param paymentServiceId
     * @param {PaymentServiceTransferRequestModel} request
     * @returns {Promise<PaymentServiceTransferResultModel>}
     */
    async doTransfer(paymentServiceId: number, request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
        return (await this.getPaymentServiceImpl(paymentServiceId)).doTransfer(request);
    }

    private async getPaymentServiceImpl(paymentServiceId: number): Promise<PaymentService> {
        const paymentService = await this.paymentServiceRepository.findOne(paymentServiceId);
        return null;
    }
}
