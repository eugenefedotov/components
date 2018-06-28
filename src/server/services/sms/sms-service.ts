import {SmsMessageModel} from './models/sms-message.model';

export interface SmsService {

  getLatestId(): Promise<number>;

  getLatestMessages(moreThenId: number): Promise<SmsMessageModel[]>;
}
