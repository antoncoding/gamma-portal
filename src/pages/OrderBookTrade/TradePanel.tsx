import React, { useMemo, useState } from 'react'
import { Box, Button, Split } from '@aragon/ui'

import MarketTicket from './MarketTicket'

import { SubgraphOToken } from '../../types'
import { simplifyOTokenSymbol } from '../../utils/others'

import { TradeAction, MarketTypes } from '../../constants'

type TradeDetailProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
}

export default function TradePanel({ selectedOToken, action, setAction }: TradeDetailProps) {
  const [marketType, setMarketType] = useState(MarketTypes.Market)

  const titleText = useMemo(
    () =>
      `${action === TradeAction.Buy ? 'Buy' : 'Sell'} ${
        selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : 'oToken'
      }`,
    [selectedOToken, action],
  )

  return (
    <Box heading={titleText}>
      <Split
        primary={
          selectedOToken === null ? (
            <> </>
          ) : marketType === MarketTypes.Market ? (
            <MarketTicket action={action} selectedOToken={selectedOToken} />
          ) : (
            <> </>
          )
        }
        secondary={
          <TradeType action={action} setAction={setAction} setMarketType={setMarketType} marketType={marketType} />
        }
      />
    </Box>
  )
}

type TradeTypeProps = {
  action: TradeAction
  setAction: any
  marketType: MarketTypes
  setMarketType: any
}

function TradeType({ action, setAction, marketType, setMarketType }: TradeTypeProps) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ paddingRight: '20', display: 'flex', marginRight: 0, marginLeft: 'auto' }}>
        <Button
          label={action === TradeAction.Buy ? 'Buy' : 'Sell'}
          mode={action === TradeAction.Buy ? 'positive' : 'negative'}
          onClick={() => (action === TradeAction.Buy ? setAction(TradeAction.Sell) : setAction(TradeAction.Buy))}
        />

        <div style={{ paddingRight: '15px' }}>
          <Button
            label={marketType === MarketTypes.Market ? 'Market' : 'Limit'}
            onClick={() =>
              marketType === MarketTypes.Market ? setMarketType(MarketTypes.Limit) : setMarketType(MarketTypes.Market)
            }
          />
        </div>
      </div>
    </div>
  )
}
