import {PayeerBaseResponseModel} from './PayeerBaseResponseModel';
import {PayeerPaymentServiceTypeEnum} from '../enums/PayeerPaymentServiceTypeEnum';

export interface PayeerOutputParamsResponseModel extends PayeerBaseResponseModel {
  outputParams: {
    sumIn: number,
    curIn: string,
    curOut: string,
    ps: PayeerPaymentServiceTypeEnum,
    sumOut: number
  },
  historyId: number
}
