import BigNumber from "bignumber.js";

export function toTokenAmount(wei: BigNumber, decimals: number) {
  return wei.div(new BigNumber(10).pow(new BigNumber(decimals)))
}

export function fromTokenAmount(amount: BigNumber, decimals: number) {
  return amount.times(new BigNumber(10).pow(new BigNumber(decimals)))
}