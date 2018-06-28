import {SmsGatewayBaseResponseModel} from './SmsGatewayBaseResponseModel';
import {SmsGatewayMessageModel} from './SmsGatewayMessageModel';

export interface SmsGatewaySmsResponseModel extends SmsGatewayBaseResponseModel {
  messages: SmsGatewayMessageModel[];
}
