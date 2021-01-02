import React, { useMemo, useState } from 'react'
import { Box, Button, Split } from '@aragon/ui'

import MarketTicket from './MarketTicket'
import LimitTicket from './LimitTicket'

import { SubgraphOToken } from '../../types'
import { simplifyOTokenSymbol } from '../../utils/others'

import { TradeAction, MarketTypes, getUSDC } from '../../constants'
import { useOTokenBalances, useTokenBalance } from '../../hooks'
import { useConnectedWallet } from '../../contexts/wallet'

type TradeDetailProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
}

export default function TradePanel({ selectedOToken, action, setAction }: TradeDetailProps) {
  const [marketType, setMarketType] = useState(MarketTypes.Market)

  const { user, networkId } = useConnectedWallet()

  const { balances: oTokenBalances } = useOTokenBalances(user, networkId)
  const usdcBalance = useTokenBalance(getUSDC(networkId).id, user, 15)

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
            <MarketTicket
              action={action}
              selectedOToken={selectedOToken}
              oTokenBalances={oTokenBalances}
              usdcBalance={usdcBalance}
            />
          ) : (
            <LimitTicket
              action={action}
              selectedOToken={selectedOToken}
              oTokenBalances={oTokenBalances}
              usdcBalance={usdcBalance}
            />
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
          size="small"
          label={marketType === MarketTypes.Market ? 'Market' : 'Limit'}
          onClick={() =>
            marketType === MarketTypes.Market ? setMarketType(MarketTypes.Limit) : setMarketType(MarketTypes.Market)
          }
        />

        <div style={{ paddingRight: '15px' }}>
          <Button
            size="small"
            label={action === TradeAction.Buy ? 'Buy' : 'Sell'}
            mode={action === TradeAction.Buy ? 'positive' : 'negative'}
            onClick={() => (action === TradeAction.Buy ? setAction(TradeAction.Sell) : setAction(TradeAction.Buy))}
          />
        </div>
      </div>
    </div>
  )
}
