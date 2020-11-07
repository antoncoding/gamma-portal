export enum PricerTypes {
  USDCPricer,
  CTokenPricer,
  ChainlinkPricer
}

export const pricerMap = {
  'USDC': PricerTypes.USDCPricer,
  'WETH': PricerTypes.ChainlinkPricer,
  'cUSDC': PricerTypes.CTokenPricer,
}