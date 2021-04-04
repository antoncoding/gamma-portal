export enum OrderType {
  NOT_OTOKEN,
  BID,
  ASK,
}

export enum OptionChainMode {
  All = 'All',
  Call = 'Call',
  Put = 'Put',
}

export enum DeadlineUnit {
  Seconds = 'seconds',
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days',
}

export enum TradeAction {
  Buy = 'buy',
  Sell = 'sell',
}

export enum TradeTypes {
  Market = 'market',
  Limit = 'limit',
}

export enum Errors {
  NO_ERROR = 'no error',
  INSUFFICIENT_LIQUIDITY = 'Insufficient Liquidity',
  INSUFFICIENT_BALANCE = 'Insufficient Balance',
}

export enum Spenders {
  MarginPool,
  ZeroXERC20Proxy,
  ZeroXStaking,
}

// use number so we can compare breakpoints. (xs < sm)
export enum BreakPoints {
  xs,
  sm,
  md,
  lg,
}
