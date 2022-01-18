import { SubgraphOToken } from '../types'

import ETH from './ETH.png'
import WBTC from './WBTC.png'
import oETH from './oETH.svg'
import oBTC from './oBTC.png'
import USDC from './USDC.png'
import USDT from './USDT.png'
import WAVAX from './WAVAX.webp'

export function getTokenImg(token: { id: string; symbol: string } | null) {
  console.log(`token.symbol`, token ? token.symbol : null)
  return token === null
    ? null
    : token.symbol === 'USDC' || token.symbol === 'USDC.e' // USDC on avax is USDC.e
    ? USDC
    : token.symbol === 'USDT'
    ? USDT
    : token.symbol === 'WETH'
    ? ETH
    : token.symbol === 'WBTC'
    ? WBTC
    : token.symbol === 'WAVAX'
    ? WAVAX
    : (token as SubgraphOToken).underlyingAsset
    ? (token as SubgraphOToken).underlyingAsset.symbol === 'WETH'
      ? oETH
      : (token as SubgraphOToken).underlyingAsset.symbol === 'WBTC'
      ? oBTC
      : null
    : null
}
