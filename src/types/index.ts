export type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type Product = {
  collateral: Token
  stike: Token
  underlying: Token
  isPut: Token
}

export enum ActionType {
  OpenVault,
  MintShortOption,
  BurnShortOption,
  DepositLongOption,
  WithdrawLongOption,
  DepositCollateral,
  WithdrawCollateral,
  SettleVault,
  Redeem,
  Call,
  InvalidAction,
}

export type actionArg = {
  actionType: ActionType;
  owner: string;
  secondAddress: string;
  asset: string;
  vaultId: string;
  amount: string;
  index: string;
  data: string;
};

export type SubgraphVault = {
  collateralAmount: string | null;
  collateralAsset: SubgraphToken | null;
  longAmount: string | null;
  longOToken: SubgraphOToken | null;
  shortAmount: string | null;
  shortOToken: SubgraphOToken | null;
};

export type SubgraphVaultAction = {
  id: string
  transactionHash: string;
  timestamp: string;
  oToken: null | { id: string; symbol: string; decimals: number };
  asset: { id: string; symbol: string; decimals: number };
  amount: null| string;
};

export type SubgraphToken = {
  id: string
  symbol: string
  name: string
  decimals: number
}

export type SubgraphOToken = SubgraphToken & {
  underlyingAsset: SubgraphToken
  expiryTimestamp: number
}

export type SubgraphPriceEntry = {
  // id: string
  expiry: string
  reportedTimestamp: string
  isDisputed: boolean
  price: string
}

export type SubgraphOracleAsset = {
  id: string
  asset: SubgraphToken
  pricer: SubgraphPricer
  prices: SubgraphPriceEntry[]
}

export type SubgraphPricer = {
  id: string
  lockingPeriod: string
  disputePeriod: string
}