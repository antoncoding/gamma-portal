import React from 'react'

import { SubgraphToken, SubgraphOToken } from '../../types'
import { EmptyToken } from '../TokenDisplay'

import {TokenAmount} from '@aragon/ui'

import ETH from '../../imgs/ETH.png'
import WBTC from '../../imgs/WBTC.png'
import oETH from '../../imgs/oETH.svg'
import USDC from '../../imgs/USDC.png'

type TokenAmountProps = {
  token: SubgraphOToken | SubgraphToken | null,
  amount: string
  chainId: number
}

export default function OpynTokenAmount({token, amount, chainId} : TokenAmountProps ) {
  if (!token) return <EmptyToken/>
  let imgUrl: null|string = null;

  if(token.symbol === 'USDC') imgUrl = USDC
  if(token.symbol === 'WETH' ) imgUrl = ETH;
  if(token.symbol === 'WBTC' ) imgUrl = WBTC;

  if((token as SubgraphOToken).underlyingAsset) {
    const symbol = (token as SubgraphOToken).underlyingAsset.symbol
    if(symbol === 'WETH' ) imgUrl = oETH;
    
  } 
  return (
    <TokenAmount 
      address={token.id} 
      amount={amount} 
      chainId={chainId}
      symbol={token.symbol}
      decimals={token.decimals}
      iconUrl={imgUrl}
    /> 
  )
}