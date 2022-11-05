import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'react-grid-system'
import BoxButton from '../../components/BoxButton'
import { Header, IconUser, IconConfiguration, IconSwap } from '@aragon/ui'

import Comment from '../../components/Comment'
import SectionTitle from '../../components/SectionHeader'
import StyledContainer from '../../components/StyledContainer'

const rysk = require('../../imgs/icons/rysk.svg')
const ribbon = require('../../imgs/icons/ribbon.svg')
const stakeDao = require('../../imgs/icons/stake-dao.png')

function HomePage() {
  const history = useHistory()
  useEffect(() => ReactGA.pageview('/'), [])
  return (
    <StyledContainer>
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
            title="Ribbon Finance"
            description="Leading DOV products"
            icon={<img height={50} src={ribbon} alt={'ribbon finance'} />}
            onClick={() => {
              window.open('https://ribbon.finance/', '_blank')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Stake Dao"
            description="Explore automatic option strategies"
            icon={<img height={50} src={stakeDao} alt={'stake dao'} />}
            onClick={() => {
              window.open('https://stakedao.org/', '_blank')
            }}
          />
        </Col>
        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Rysk Finance"
            description="Dynamic Hedging Vault"
            icon={<img height={50} src={rysk} alt={'Opeth Finance'} />}
            onClick={() => {
              window.open('https://www.rysk.finance/', '_blank')
            }}
          />
        </Col>
      </Row>

      {/* <SectionTitle title={'Stats'} />

      <Row>
        <Col sm={12} md={6} lg={4}>
          <TotalAsset />
        </Col>

        <Col sm={12} md={6} lg={4}></Col>

        <Col sm={12} md={6} lg={4}></Col>
      </Row> */}
    </StyledContainer>
  )
}

export default HomePage
