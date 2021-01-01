import React, { useMemo, useState } from 'react'

import { Box, Button, TextInput, Split, IconArrowRight } from '@aragon/ui'
import { SubgraphOToken, OrderWithMetaData } from '../../types'

// import { getAskPrice, getBidPrice, getOrderFillRatio, getRemainingAmounts } from '../../utils/0x-utils'
// import { green, red } from './StyleDiv'
// import { toTokenAmount } from '../../utils/math'
// import { generateNoOrderContent, NO_TOKEN_SELECTED } from '../../constants/dataviewContents'
import { TradeAction, MarketTypes } from '../../constants'
import { simplifyOTokenSymbol } from '../../utils/others'
import LabelText from '../../components/LabelText'
import BigNumber from 'bignumber.js'
import { useConnectedWallet } from '../../contexts/wallet'

import { getUSDC } from '../../constants/addresses'

import oETHIcon from '../../imgs/oETH.svg'
import USDCIcon from '../../imgs/USDC.png'

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

type MarketTicketProps = {
  action
  selectedOToken: SubgraphOToken
}

function MarketTicket({ action, selectedOToken }: MarketTicketProps) {
  const { networkId } = useConnectedWallet()

  const paymentToken = useMemo(() => getUSDC(networkId), [networkId])

  const inputToken = useMemo(() => (action === TradeAction.Buy ? paymentToken : selectedOToken), [
    paymentToken,
    selectedOToken,
    action,
  ])
  const inputIcon = useMemo(
    () => <img alt="inputtoken" width={23} src={action === TradeAction.Buy ? USDCIcon : oETHIcon} />,
    [action],
  )

  const outputToken = useMemo(() => (action === TradeAction.Buy ? selectedOToken : paymentToken), [
    paymentToken,
    selectedOToken,
    action,
  ])
  const outputIcon = useMemo(
    () => <img alt="outputtoken" width={23} src={action === TradeAction.Buy ? oETHIcon : USDCIcon} />,
    [action],
  )

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <TextInput adornment={inputIcon} adornmentPosition="end" />
      </div>
      <div style={{ padding: '5px' }}>
        <IconArrowRight size="medium" />
      </div>
      <div>
        <TextInput adornment={outputIcon} adornmentPosition="end" />
      </div>
    </div>
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
    <div style={{ display: 'flex', width: '100%' }}>
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
