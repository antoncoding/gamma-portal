import React, { useMemo } from 'react'

import { Box, Button, Split } from '@aragon/ui'
import { SubgraphOToken, OrderWithMetaData } from '../../types'

// import { getAskPrice, getBidPrice, getOrderFillRatio, getRemainingAmounts } from '../../utils/0x-utils'
// import { green, red } from './StyleDiv'
// import { toTokenAmount } from '../../utils/math'
// import { generateNoOrderContent, NO_TOKEN_SELECTED } from '../../constants/dataviewContents'
import { TradeAction } from '../../constants'
import { simplifyOTokenSymbol } from '../../utils/others'
import SectionTitle from '../../components/SectionHeader'

type TradeDetailProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
  selectedOrders: OrderWithMetaData[]
  setSelectedOrders: React.Dispatch<React.SetStateAction<OrderWithMetaData[]>>
}

export default function TradePanel({
  selectedOToken,
  action,
  setAction,
  selectedOrders,
  setSelectedOrders,
}: TradeDetailProps) {
  const titleText = useMemo(
    () =>
      `${action === TradeAction.Buy ? 'Buy' : 'Sell'} ${
        selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : 'oToken'
      }`,
    [selectedOToken, action],
  )

  return (
    <Box>
      <Split
        primary={<SectionTitle title={titleText} paddingTop={0} />}
        secondary={
          <div style={{ display: 'flex' }}>
            {action === TradeAction.Buy ? (
              <Button label={'Buy'} mode="positive" />
            ) : (
              <Button label={'Buy'} onClick={() => setAction(TradeAction.Buy)} />
            )}
            {action === TradeAction.Sell ? (
              <Button label={'Sell'} mode="negative" />
            ) : (
              <Button label={'Sell'} onClick={() => setAction(TradeAction.Sell)} />
            )}
          </div>
        }
      />
    </Box>
  )
}
