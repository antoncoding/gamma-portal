import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import BoxButton from '../../components/BoxButton'
import { Header, IconUser, IconConfiguration, IconSwap } from '@aragon/ui'

import Comment from '../../components/Comment'

function HomePage() {
  const history = useHistory()
  useEffect(() => ReactGA.pageview('/'), [])
  return (
    <Container>
      <Header primary="Welcome to Gamma Portal" />

      <Comment padding={0} text="Create, manage and trade decentralized options" />

      <br />
      <br />
      <Row>
        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Account"
            description="Manage vaults and positions"
            icon={<IconUser size="large" />}
            onClick={() => {
              history.push('/account/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Protocol"
            description="Protocol configs"
            icon={<IconConfiguration size="large" />}
            onClick={() => {
              history.push('/protocol/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Trade"
            description="Trade with 0x"
            icon={<IconSwap size="large" />}
            onClick={() => {
              history.push('/trade/')
            }}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default HomePage
