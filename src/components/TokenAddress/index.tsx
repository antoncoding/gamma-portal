import React from 'react'

import { SubgraphToken, Token } from '../../types'
import CustomIdentityBadge from '../CustomIdentityBadge'
import { ZERO_ADDR } from '../../constants/addresses'

function TokenBadge({
  token,
  nullLabel = 'Empty',
}: {
  token: null | { symbol: string; address: string } | { symbol: string; id: string }
  nullLabel?: string
}) {
  let address = ZERO_ADDR
  let label = nullLabel
  if (token !== null) {
    address = (token as SubgraphToken).id ? (token as SubgraphToken).id : (token as Token).id
    label = token.symbol
  }
  return <CustomIdentityBadge label={label} entity={address} />
}

export default TokenBadge
