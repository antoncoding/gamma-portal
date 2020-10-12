export type Token = {
  address: string,
  name: string,
  symbol: string,
  decimals: number
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
  actionType:ActionType;
  owner: string;
  secondAddress: string;
  asset: string;
  vaultId: string;
  amount: string;
  index: string;
  data: string;
} 

export type SubgraphVault = {
  collateralAmount: string | null
  collateralAsset: string | null
  longAmount: string | null
  longOToken: {id: string} | null
  shortAmount: string | null
  shortOToken: {id: string} | null
}