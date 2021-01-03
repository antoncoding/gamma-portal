export type OrderWithMetaData = {
  order: SignedOrder
  metaData: {
    orderHash: string
    remainingFillableTakerAssetAmount: string
  }
}

export type SignedOrder = {
  chainId: number
  exchangeAddress: string
  makerAddress: string
  takerAddress: string
  feeRecipientAddress: string
  senderAddress: string
  makerAssetAmount: string
  takerAssetAmount: string
  makerFee: string
  takerFee: string
  expirationTimeSeconds: string
  salt: string
  makerAssetData: string
  takerAssetData: string
  makerFeeAssetData: string
  takerFeeAssetData: string
  signature: string
}

export type OTokenOrderBook = {
  id: string
  asks: OrderWithMetaData[]
  bids: OrderWithMetaData[]
}

export type OTokenOrderBookWithDetail = OTokenOrderBook & {
  bestAskPrice: string
  bestBidPrice: string
  totalBidAmt: string
  totalAskAmt: string
}
