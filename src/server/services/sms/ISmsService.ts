import {SmsMessageModel} from './models/SmsMessageModel';

export interface ISmsService {

  getLatestId(): Promise<number>;

  getLatestMessages(moreThenId: number): Promise<SmsMessageModel[]>;
}
