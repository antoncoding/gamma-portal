export enum PricerTypes {
  USDCPricer = 'USD Pricer',
  CTokenPricer = 'cToken Pricer',
  ChainlinkPricer = 'Chainlink Pricer',
}

export const pricerMap = {
  USDC: PricerTypes.USDCPricer,
  WETH: PricerTypes.ChainlinkPricer,
  cUSDC: PricerTypes.CTokenPricer,
}
