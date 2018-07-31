export interface BitcoinTransactionInfoModel {
    "amount": number,
    "fee": number,
    "blockindex": number,
    "details": {
        "fee": number,
        "amount": number,
        "blockindex": number,
        "category": string,
        "confirmations": number,
        "address": string,
        "txid": string,
        "block": number,
        "blockhash": string
    }[],
    "confirmations": number,
    "txid": string,
    "block": number,
    "blockhash": string
}