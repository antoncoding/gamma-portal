import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import BoxButton from '../../components/BoxButton'
import { Header, IconUser, IconConfiguration, IconSwap } from '@aragon/ui'

import Comment from '../../components/Comment'
import SectionTitle from '../../components/SectionHeader'
import TotalAsset from './TotalAsset'

const ribbon = require('../../imgs/icons/ribbon.svg')
const opynLogo = require('../../imgs/icons/opyn.png')

function HomePage() {
  const history = useHistory()
  useEffect(() => ReactGA.pageview('/'), [])
  return (
    <Container>
      <Header primary="Welcome to Gamma Portal" />

      <Comment padding={0} text="Create, manage and trade decentralized options" />

      <SectionTitle title={'Core'} />
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

      <SectionTitle title={'Applications'} />
      <Row>
        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Opyn.co"
            description="Trade the most capital efficient defi options"
            icon={<img height={50} src={opynLogo} alt={'opyn official'} />}
            onClick={() => {}}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Ribbon Finance"
            description="buy ETH strangles"
            icon={<img height={50} src={ribbon} alt={'ribbon finance'} />}
            onClick={() => {
              window.location.href = 'https://ribbon.finance/'
            }}
          />
        </Col>
      </Row>

      <SectionTitle title={'Stats'} />

      <Row>
        <Col sm={12} md={6} lg={4}>
          <TotalAsset />
        </Col>

        <Col sm={12} md={6} lg={4}></Col>

        <Col sm={12} md={6} lg={4}></Col>
      </Row>
    </Container>
  )
}

export default HomePage
