import React, { useMemo, useState } from 'react'

import { Box, Button, TextInput } from '@aragon/ui'
import { SubgraphOToken, OrderWithMetaData } from '../../types'

// import { getAskPrice, getBidPrice, getOrderFillRatio, getRemainingAmounts } from '../../utils/0x-utils'
// import { green, red } from './StyleDiv'
// import { toTokenAmount } from '../../utils/math'
// import { generateNoOrderContent, NO_TOKEN_SELECTED } from '../../constants/dataviewContents'
import { TradeAction, MarketTypes } from '../../constants'
import { simplifyOTokenSymbol } from '../../utils/others'
import LabelText from '../../components/LabelText'
import BigNumber from 'bignumber.js'

type TradeDetailProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
}

export default function TradePanel({ selectedOToken, action, setAction }: TradeDetailProps) {
  const [marketType, setMarketType] = useState(MarketTypes.Market)

  const [price, setPrice] = useState(new BigNumber(0))
  const [oTokenAmount, setOTokenAmount] = useState(new BigNumber(0))

  const titleText = useMemo(
    () =>
      `${action === TradeAction.Buy ? 'Buy' : 'Sell'} ${
        selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : 'oToken'
      }`,
    [selectedOToken, action],
  )

  return (
    <Box heading={titleText}>
      <TradeType action={action} setAction={setAction} setMarketType={setMarketType} marketType={marketType} />
      <br />
      <div style={{ display: 'flex' }}>
        <div>
          <LabelText label={`Amount to ${action}`} />
          <TextInput adornment={`o${selectedOToken?.underlyingAsset.symbol ?? 'Token'}`} adornmentPosition="end" />
        </div>

        <div>
          <LabelText label="Price" />
          <TextInput adornment="USDC" adornmentPosition="end" />
        </div>
      </div>
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
    // <div style={{ width: '100%' }}>
    <div style={{ display: 'flex', width: '100%' }}>
      {/* Buy or sell */}
      <div style={{ paddingRight: '20', display: 'flex', marginRight: 0, marginLeft: 'auto' }}>
        <Button
          size="small"
          label={'Buy'}
          mode={action === TradeAction.Buy ? 'positive' : 'normal'}
          onClick={() => setAction(TradeAction.Buy)}
        />

        <div style={{ paddingRight: '15px' }}>
          <Button
            size="small"
            label={'Sell'}
            mode={action === TradeAction.Sell ? 'negative' : 'normal'}
            onClick={() => setAction(TradeAction.Sell)}
          />
        </div>
        <Button
          size="small"
          label="Market"
          mode={marketType === MarketTypes.Market ? 'strong' : 'normal'}
          onClick={() => setMarketType(MarketTypes.Market)}
        />

        <Button
          size="small"
          label="Limit"
          mode={marketType === MarketTypes.Limit ? 'strong' : 'normal'}
          onClick={() => setMarketType(MarketTypes.Limit)}
        />
      </div>
    </div>
    // </div>
  )
}
