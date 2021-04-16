import React, { useState, useMemo } from 'react'

import { SubgraphToken, SubgraphOToken } from '../../types'
import { EmptyToken } from '../TokenDisplay'

import { TokenAmount, LinkBase, Modal, AddressField } from '@aragon/ui'

import { simplifyOTokenSymbol } from '../../utils/others'
import { getTokenImg } from '../../imgs/utils'

type TokenAmountProps = {
  token: SubgraphOToken | SubgraphToken | null
  amount: string
  chainId: number
}

export default function OpynTokenAmount({ token, amount, chainId }: TokenAmountProps) {
  const [open, setOpen] = useState(false)

  const imgUrl = useMemo(() => {
    return getTokenImg(token)
  }, [token])

  const symbol =
    token === null
      ? ''
      : (token as SubgraphOToken).strikePrice !== undefined
      ? simplifyOTokenSymbol(token?.symbol)
      : token?.symbol

  return token ? (
    <>
      <LinkBase onClick={() => setOpen(true)}>
        <TokenAmount
          address={token.id}
          amount={amount}
          chainId={chainId}
          symbol={symbol}
          decimals={token.decimals}
          iconUrl={imgUrl}
          digits={8}
        />
      </LinkBase>
      <Modal visible={open} onClose={() => setOpen(false)}>
        <AddressField address={token.id} />
      </Modal>
    </>
  ) : (
    <EmptyToken />
  )
}
