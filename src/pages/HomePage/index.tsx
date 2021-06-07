import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-grid-system'
import BoxButton from '../../components/BoxButton'
import { Header, IconUser, IconConfiguration, IconSwap } from '@aragon/ui'

import Comment from '../../components/Comment'
import SectionTitle from '../../components/SectionHeader'
import TotalAsset from './TotalAsset'

const opeth = require('../../imgs/icons/opeth.png')
const ribbon = require('../../imgs/icons/ribbon.svg')
const opynLogo = require('../../imgs/icons/opyn.png')

function HomePage() {
  const history = useHistory()
  useEffect(() => ReactGA.pageview('/'), [])
  return (
    <Container>
      <Header primary="Gamma Portal" />

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
            icon={<img height={24} style={{ margin: 13 }} src={opynLogo} alt={'opyn official'} />}
            onClick={() => {
              window.open('https://opyn.co', '_blank')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Ribbon Finance"
            description="Invest in Delta Vault"
            icon={<img height={50} src={ribbon} alt={'ribbon finance'} />}
            onClick={() => {
              window.open('https://ribbon.finance/', '_blank')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Opeth Finance"
            description="Smart collateral for DeFi powered by Options"
            icon={<img height={50} src={opeth} alt={'Opeth Finance'} />}
            onClick={() => {
              window.open('https://opeth.finance/', '_blank')
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
