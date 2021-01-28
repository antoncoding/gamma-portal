import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'

import { ZERO_ADDR } from '../constants'

/**
 * get token price by address.
 * @param token token address
 * @param refetchIntervalSec refetch interval in seconds
 * @returns {BigNumber} price denominated in USD
 */
export const useTokenPrice = (token: string | undefined, refetchIntervalSec: number = 20): BigNumber => {
  const [price, setPrice] = useState(new BigNumber(0))

  useEffect(() => {
    let isCancelled = false

    async function updatePrice() {
      const price = await getTokenPriceCoingecko(token)
      if (!isCancelled) setPrice(price)
    }
    updatePrice()
    const id = setInterval(updatePrice, refetchIntervalSec * 1000)

    // cleanup function: remove interval
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [token, refetchIntervalSec])

  return price
}

export const getTokenPriceCoingecko = async (token: string | undefined): Promise<BigNumber> => {
  if (!token || token === ZERO_ADDR) return new BigNumber(0)
  let requestAddr = token
  // map kovan address to mainnet address
  // WETH
  if (requestAddr === '0xd0a1e359811322d97991e03f863a0c30c2cf029c')
    requestAddr = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  // WBTC
  if (requestAddr === '0xd3a691c852cdb01e281545a27064741f0b7f6825')
    requestAddr = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'

  const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${requestAddr}&vs_currencies=usd`
  const res = await fetch(url)
  const priceStruct: { usd: number } = (await res.json())[requestAddr.toLowerCase()]
  if (priceStruct === undefined) return new BigNumber(0)
  const price = priceStruct.usd
  return new BigNumber(price)
}
