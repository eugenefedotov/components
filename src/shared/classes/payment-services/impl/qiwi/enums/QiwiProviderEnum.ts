/**
 99 - Перевод на QIWI Wallet
 1963 - Перевод на карту Visa (карты российских банков)
 21013 - Перевод на карту MasterCard (карты российских банков)
 Для карт, выпущенных банками стран Азербайджан, Армения, Белоруссия, Грузия, Казахстан, Киргизия, Молдавия, Таджикистан, Туркменистан, Украина, Узбекистан:
 1960 – Перевод на карту Visa
 21012 – Перевод на карту MasterCard
 31652 - национальная платежная система МИР
 466 - Тинькофф Банк
 464 - Альфа-Банк
 821 - Промсвязьбанк
 815 - Русский Стандарт
 Идентификаторы операторов мобильной связи - https://developer.qiwi.com/ru/qiwi-wallet-personal/index.html#cell
 Идентификаторы других провайдеров - https://developer.qiwi.com/ru/qiwi-wallet-personal/index.html#charity
 1717 - платеж по банковским реквизитам
 */
export enum QiwiProviderEnum {
  QiwiWallet = 99,
  VisaRub = 1963,
  MasterCardRub = 21013,
  VisaCis = 1960,
  MasterCardCis = 21012,
  Mir = 31652,
  TinkoffBank = 466,
  AlfaBank = 464,
  PromsvjazBank = 821,
  RusStandartBank = 815,
  BankRequisites = 1717
}
