import {PaymentService} from '../../payment-service';
import {PaymentServiceAccountModel} from '../../models/payment-service-account.model';
import {PaymentServiceTransferResultModel} from '../../models/payment-service-transfer-result.model';
import {PaymentServiceBalanceModel} from '../../models/payment-service-balance.model';
import {PaymentServiceTransferRequestModel} from '../../models/payment-service-transfer-request.model';

export class TestPaymentService implements PaymentService {
    doTransfer(request: PaymentServiceTransferRequestModel): Promise<PaymentServiceTransferResultModel> {
        return undefined;
    }

    getBalances(account: PaymentServiceAccountModel): Promise<PaymentServiceBalanceModel[]> {
        return undefined;
    }

    getReceiveRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return undefined;
    }

    getReceiveTransfers(account: PaymentServiceAccountModel, targetRequisite: string, currencyCode: string, fromDate: Date, toDate: Date): Promise<PaymentServiceTransferResultModel[]> {
        return undefined;
    }

    getSourceRequisite(account: PaymentServiceAccountModel, currencyCode: string): Promise<string> {
        return undefined;
    }
}
