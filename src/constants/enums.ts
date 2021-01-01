export enum OrderType {
  NOT_OTOKEN,
  BID,
  ASK,
}

export enum TradeAction {
  Buy = 'buy',
  Sell = 'sell',
}

export enum MarketTypes {
  Market = 'market',
  Limit = 'limit',
}

export enum Errors {
  NO_ERROR,
  INSUFFICIENT_LIQUIDITY,
}
