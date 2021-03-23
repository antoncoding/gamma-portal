import React from 'react'

import { SubgraphOToken } from '../../types'

import oETH from '../../imgs/oETH.svg'
import oBTC from '../../imgs/oBTC.png'

export default function OTokenIcon({ otoken, width }: { otoken: SubgraphOToken; width: number }) {
  const url = otoken.underlyingAsset.symbol === 'WETH' ? oETH : oBTC
  return <img width={width} src={url} alt={'otoken'} />
}
