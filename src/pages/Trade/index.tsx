import React, { useEffect } from 'react'
import ReactGA from 'react-ga'

import { useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import BoxButton from '../../components/BoxButton'

import { Header, IconCopy, IconSwap, IconGroup } from '@aragon/ui'

import Comment from '../../components/Comment'

function TradePage() {
  const history = useHistory()
  useEffect(() => {
    ReactGA.pageview('/trade/')
  }, [])
  return (
    <Container>
      <Header primary="Trade" />
      <Comment padding={0} text="Buy / Sell oTokens" />
      <br />
      <br />
      <Row>
        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Swap"
            description="Simple swap between oToken and USDC"
            icon={<IconSwap size="large" />}
            onClick={() => {
              history.push('/trade/swap/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="OTC"
            description="Private OTC Trade"
            icon={<IconGroup size="large" />}
            onClick={() => {
              history.push('/trade/otc/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Orderbook"
            description="Advanced trading venue"
            icon={<IconCopy size="large" />}
            onClick={() => {
              history.push('/trade/orderbook/')
            }}
          />
        </Col>
        <div style={{ width: '30%', marginLeft: '3%' }}></div>
      </Row>
    </Container>
  )
}

export default TradePage
