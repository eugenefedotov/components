import {PayeerBaseResponseModel} from './PayeerBaseResponseModel';

export interface PayeerHistoryInfoModel extends PayeerBaseResponseModel {
  info: {
    id: string; // "19794139",
    dateCreate: string; // "14.01.2015 14:00:00",
    type: string; // "transfer",
    status: string; // "execute",
    from: string; // "P1000000",
    sumIn: string; // "1",
    curIn: string; // "RUB",
    to: string; // "P1000001",
    sumOut: string; // "0.99",
    curOut: string; // "RUB",
    comSite: string; // "0.01",
    comGate: null,
    exchangeCourse: string; // "0",
    protect: string; // "N",
    protectCode: null,
    protectDay: null,
    comment: null,
    psId: null,
    isApi: string; // "Y",
    error: string; // "",
    isExchange: string; // "N"
  }
}
