import {Service} from '@tsed/common';
import {PaymentServiceTransferResultModel} from '../common/payment-services/models/payment-service-transfer-result.model';
import {PaymentServiceBalanceModel} from '../common/payment-services/models/payment-service-balance.model';
import {PaymentServiceTransferRequestModel} from '../common/payment-services/models/payment-service-transfer-request.model';
import {getCustomRepository} from 'typeorm';
import {PaymentServiceRepository} from '../../dao/payment-service/payment-service.repository';
import {PaymentService} from '../common/payment-services/payment-service';
import {PaymentServiceAccountEntity} from '../../dao/payment-service-account/payment-service-account.entity';
import {PaymentServiceEntity} from '../../dao/payment-service/payment-service.entity';
import {QiwiPaymentService} from '../common/payment-services/impl/qiwi/QiwiPaymentService';
import {CurrencyService} from './currency.service';

@Service()
export class PaymentServiceService {

    private paymentServiceRepository = getCustomRepository(PaymentServiceRepository);

    constructor(private currencyService: CurrencyService) {

    }

    /**
     * Получение платежного реквизита, с которого отправляются средства
     * @param account информация для авторизации в платежном сервисе
     * @param currencyCode Код валюты
     */
    async getSourceRequisite(account: PaymentServiceAccountEntity, currencyCode: string): Promise<string> {
        return (await this.getPaymentServiceImpl(account.paymentService)).getSourceRequisite(account, currencyCode);
    }

    /**
     * Получение платежного реквизита, на который должны поступить средства
     * @param account информация для авторизации в платежном сервисе
     * @param currencyCode Код валюты зачисления
     */
    async getReceiveRequisite(account: PaymentServiceAccountEntity, currencyCode: string): Promise<string> {
        return (await this.getPaymentServiceImpl(account.paymentService)).getSourceRequisite(account, currencyCode);
    }

    /**
     * Получение списка транзакций
     * @param account информация для авторизации в платежном сервисе
     * @param targetRequisite Реквизит, на который должны были поступить средства
     * @param currencyCode Код валюты зачисления
     * @param fromDate С
     * @param toDate По
     */
    async getReceiveTransfers(account: PaymentServiceAccountEntity, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        return (await this.getPaymentServiceImpl(account.paymentService)).getReceiveTransfers(account, targetRequisite, currencyCode, fromDate, toDate);
    }

    /**
     * Получение информации о имеющихся средствах в различных валютах
     * @param account информация для авторизации в платежном сервисе
     * @returns {Promise<PaymentServiceBalanceModel[]>}
     */
    async getBalances(account: PaymentServiceAccountEntity): Promise<PaymentServiceBalanceModel[]> {
        return (await this.getPaymentServiceImpl(account.paymentService)).getBalances(account);
    }

    /**
     * Выполнение перевода средств
     * @param request
     */
    async doTransfer(request: PaymentServiceTransferRequestModel<PaymentServiceAccountEntity>): Promise<PaymentServiceTransferResultModel> {
        return (await this.getPaymentServiceImpl(request.sourceAccount.paymentService)).doTransfer(request);
    }

    private async getPaymentServiceImpl(paymentService: PaymentServiceEntity): Promise<PaymentService> {
        switch (paymentService.code) {
            case 'QW':
                return new QiwiPaymentService(this.currencyService);
            default:
                throw new Error(`payment service ${paymentService.code} not implemented`);
        }
    }
}
