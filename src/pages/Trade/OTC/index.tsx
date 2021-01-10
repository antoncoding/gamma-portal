import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-grid-system'
import ReactGA from 'react-ga'
import { Header, Tabs } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import { useOTokenBalances, useTokenBalance, useLiveOTokens } from '../../../hooks'
import { getUSDC, getWeth } from '../../../constants'

import MakeOrder from './MakeOrder'
import TakerOrder from './TakeOrder'

export default function OTC() {
  useEffect(() => {
    ReactGA.pageview('trade/otc/')
  }, [])

  const { user, networkId } = useConnectedWallet()

  const { balances: oTokenBalances } = useOTokenBalances(user, networkId)
  const usdcBalance = useTokenBalance(getUSDC(networkId).id, user, 15)
  const wethBalance = useTokenBalance(getWeth(networkId).id, user, 15)
  const { allOtokens } = useLiveOTokens()

  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <>
      <Header primary={'OTC'} />

      <Row>
        <Col xl={3} lg={4} md={6} sm={12}>
          <Tabs selected={selectedTab} onChange={setSelectedTab} items={['Make Order', 'Take Order']} />
        </Col>
      </Row>

      {selectedTab === 0 && (
        <MakeOrder allOtokens={allOtokens} usdcBalance={usdcBalance} oTokenBalances={oTokenBalances} />
      )}
      {selectedTab === 1 && (
        <TakerOrder
          wethBalance={wethBalance}
          usdcBalance={usdcBalance}
          oTokenBalances={oTokenBalances}
          allOtokens={allOtokens}
        />
      )}
    </>
  )
}
