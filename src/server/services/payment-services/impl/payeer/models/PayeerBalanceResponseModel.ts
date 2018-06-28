import {PayeerBaseResponseModel} from './PayeerBaseResponseModel';
import {PayeerBalanceItemModel} from './PayeerBalanceItemModel';

export interface PayeerBalanceResponseModel extends PayeerBaseResponseModel {
  balance: { [key: string]: PayeerBalanceItemModel };
}
