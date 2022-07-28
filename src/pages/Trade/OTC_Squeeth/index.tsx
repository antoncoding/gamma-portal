import React, { useState } from 'react'
import { Col, Row } from 'react-grid-system'
import { Tabs, Info } from '@aragon/ui'
import { Header } from '../../../components/Header'
import StyledContainer from '../../../components/StyledContainer'
import { useConnectedWallet } from '../../../contexts/wallet'
import { useTokenBalance } from '../../../hooks'
import { SupportedNetworks } from '../../../constants'

import MakeOrder from './MakeOrderDetail'
import TakerOrder from './TakeOrder'

import { squeeth, weth } from './constants'

export default function OTC() {

  const { user, networkId } = useConnectedWallet()
  const wethBalance = useTokenBalance(weth.id, user, 30)
  const squeethBalance = useTokenBalance(squeeth.id, user, 30)

  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <StyledContainer>
      <Header primary={'Squeeth OTC'} />

      {(networkId !== SupportedNetworks.Mainnet) ? (
      <Info mode="error"> Squeeth OTC is only on mainnet </Info>
      ) : (
        <>
      <Row>
        <Col xl={4} lg={5} md={6} sm={12}>
          <Tabs selected={selectedTab} onChange={setSelectedTab} items={['Make Order', 'Take Order']} />
        </Col>
      </Row>

      {selectedTab === 0 && (
        <MakeOrder paymentTokenBalance={wethBalance} squeethBalance={squeethBalance} />
      )}
      {selectedTab === 1 && (
        <TakerOrder paymentTokenBalance={wethBalance} squeethBalance={squeethBalance} />
      )}
      </>
      )}
    </StyledContainer>
  )
}
