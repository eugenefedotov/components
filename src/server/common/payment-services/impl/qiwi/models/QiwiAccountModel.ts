import {QiwiSumWithCurrencyModel} from './QiwiSumWithCurrencyModel';

export interface QiwiAccountModel {
  alias: string, // "qw_wallet_rub",
  fsAlias: string, // "qb_wallet",
  title: string, // "WALLET",
  type: {
    id: string, // "WALLET",
    title: string, // "QIWI Wallet"
  },
  hasBalance: boolean, // true,
  balance?: QiwiSumWithCurrencyModel,
  currency: number, // number-3 ISO-4217
}
