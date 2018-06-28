import {Service} from 'typedi';
import {SmsGatewayBaseRequestModel} from './models/SmsGatewayBaseRequestModel';
import {SmsGatewaySmsResponseModel} from './models/SmsGatewaySmsResponseModel';
import * as requestPromise from 'request-promise';
import {ISmsService} from '../../ISmsService';
import {SmsMessageModel} from '../../models/SmsMessageModel';

const API_URL = `http://10.100.100.30:8080/v1/`;

@Service('sms-service.+79523268568')
export class SmsGatewayService implements ISmsService {

  async getMessages(request: SmsGatewayBaseRequestModel): Promise<SmsGatewaySmsResponseModel> {
    return requestPromise.get(`${API_URL}sms/`, {
      qs: request,
      json: true
    });
  }

  async getLatestId(): Promise<number> {
    const messages = await this.getMessages({limit: 1, offset: 0});
    return messages.messages.length ? Number(messages.messages[0]._id) : null;
  }

  async getLatestMessages(moreThenId: number): Promise<SmsMessageModel[]> {
    const messages = await this.getMessages({offset: 0, limit: 100});
    return messages.messages
      .filter(msg => Number(msg._id) > moreThenId)
      .map(msg => <SmsMessageModel>{
        id: Number(msg._id),
        sender: msg.address,
        text: msg.body
      });
  }
}
