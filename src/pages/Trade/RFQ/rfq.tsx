import React, { useMemo, useState } from 'react'
import { Row, Col, Hidden } from 'react-grid-system'
import BigNumber from 'bignumber.js'
import { Box, Button, useTheme } from '@aragon/ui'

import MainTicket from './main'

import { SubgraphOToken } from '../../../types'
import { simplifyOTokenSymbol } from '../../../utils/others'

import { TradeAction, getWeth, getPrimaryPaymentToken } from '../../../constants'
import { useOTokenBalances, useTokenBalance } from '../../../hooks'
import { useConnectedWallet } from '../../../contexts/wallet'

type RFQProps = {
  selectedOToken: SubgraphOToken | null
  action: TradeAction
  setAction: any
}

export default function RFQ({ selectedOToken, action, setAction }: RFQProps) {
  const theme = useTheme()

  const { user, networkId } = useConnectedWallet()

  const [inputTokenAmount, setInputTokenAmount] = useState(new BigNumber(1))
  const [outputTokenAmount, setOutputTokenAmount] = useState(new BigNumber(0))

  const { balances: oTokenBalances } = useOTokenBalances(user, networkId)
  const usdBalance = useTokenBalance(getPrimaryPaymentToken(networkId).id, user, 15)
  const wethBalance = useTokenBalance(getWeth(networkId).id, user, 15)

  const titleText = useMemo(
    () =>
      `${action === TradeAction.Buy ? 'Buy' : 'Sell'} ${
        selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : 'oToken'
      }`,
    [selectedOToken, action],
  )

  return (
    <Box heading={titleText}>
      <Row>
        <Col sm={12} lg={8} xl={9}>
          {selectedOToken === null ? (
            <div style={{ color: theme.contentSecondary }}> Select an oToken to proceed </div>
          ) : (
            <MainTicket
              inputTokenAmount={inputTokenAmount}
              setInputTokenAmount={setInputTokenAmount}
              outputTokenAmount={outputTokenAmount}
              setOutputTokenAmount={setOutputTokenAmount}
              action={action}
              selectedOToken={selectedOToken}
              oTokenBalances={oTokenBalances}
              usdBalance={usdBalance}
              wethBalance={wethBalance}
            />
          )}
        </Col>
        <Hidden xs sm md>
          <Col lg={4} xl={3}>
            <BuyOrSell action={action} setAction={setAction} />
          </Col>
        </Hidden>
      </Row>
    </Box>
  )
}

type BuyOrSell = {
  action: TradeAction
  setAction: any
}

// market buy / market sell / limit buy / limit sell
function BuyOrSell({ action, setAction }: BuyOrSell) {
  return (
    <div style={{ display: 'flex' }}>
      <Button
        size="small"
        label={'Buy'}
        mode={action === TradeAction.Buy ? 'positive' : 'normal'}
        onClick={() => setAction(TradeAction.Buy)}
      />
      <Button
        size="small"
        label={'Sell'}
        mode={action === TradeAction.Sell ? 'negative' : 'normal'}
        onClick={() => setAction(TradeAction.Sell)}
      />
    </div>
  )
}
