import BigNumber from 'bignumber.js'
import { ZERO_ADDR } from '../../constants/addresses'
import { actionArg, ActionType } from '../../types'

export function createOpenVaultArg(account: string, vaultId: BigNumber): actionArg {
  return {
    actionType: ActionType.OpenVault,
    owner: account,
    secondAddress: account,
    asset: ZERO_ADDR,
    vaultId: vaultId.toString(),
    amount: '0',
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createDepositCollateralArg(
  account: string,
  from: string,
  vaultId: BigNumber,
  asset: string,
  amount: BigNumber,
): actionArg {
  return {
    actionType: ActionType.DepositCollateral,
    owner: account,
    secondAddress: from,
    asset: asset,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createWithdrawCollateralArg(
  account: string,
  to: string,
  vaultId: BigNumber,
  asset: string,
  amount: BigNumber,
): actionArg {
  return {
    actionType: ActionType.WithdrawCollateral,
    owner: account,
    secondAddress: to,
    asset: asset,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createMintShortArg(
  account: string,
  to: string,
  vaultId: BigNumber,
  oToken: string,
  amount: BigNumber,
): actionArg {
  return {
    actionType: ActionType.MintShortOption,
    owner: account,
    secondAddress: to,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createBurnShortArg(
  account: string,
  from: string,
  vaultId: BigNumber,
  oToken: string,
  amount: BigNumber,
): actionArg {
  return {
    actionType: ActionType.BurnShortOption,
    owner: account,
    secondAddress: from,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createDepositLongArg(
  account: string,
  from: string,
  vaultId: BigNumber,
  oToken: string,
  amount: BigNumber,
): actionArg {
  return {
    actionType: ActionType.DepositLongOption,
    owner: account,
    secondAddress: from,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createWithdrawLongArg(
  account: string,
  to: string,
  vaultId: BigNumber,
  oToken: string,
  amount: BigNumber,
): actionArg {
  return {
    actionType: ActionType.WithdrawLongOption,
    owner: account,
    secondAddress: to,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createSettleArg(account: string, to: string, vaultId: BigNumber): actionArg {
  return {
    actionType: ActionType.SettleVault,
    owner: account,
    secondAddress: to,
    asset: ZERO_ADDR,
    vaultId: vaultId.toString(),
    amount: '0',
    index: '0',
    data: ZERO_ADDR,
  }
}

export function createRedeemArg(token: string, amount: string, to: string): actionArg {
  return {
    actionType: ActionType.Redeem,
    owner: ZERO_ADDR,
    secondAddress: to,
    asset: token,
    vaultId: '0',
    amount: amount,
    index: '0',
    data: ZERO_ADDR,
  }
}
