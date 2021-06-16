import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { Row, Col } from 'react-grid-system'
import { useHistory } from 'react-router-dom'
import { BoxButton } from '../../components/BoxButton'
import { IconCoin, IconMenu, useTheme } from '@aragon/ui'
import Header from '../../components/Header'
import Comment from '../../components/Comment'
import StyledContainer from '../../components/StyledContainer'
import factoryBlack from '../../imgs/icons/factory-black.png'
import factoryWhite from '../../imgs/icons/factory-white.png'
import dripBlack from '../../imgs/icons/drip-black.png'
import dripWhite from '../../imgs/icons/drip-white.png'

function ProtocolPage() {
  const theme = useTheme()
  const history = useHistory()
  useEffect(() => ReactGA.pageview('/protocol/'), [])
  return (
    <StyledContainer>
      <Header primary="Protocol" />
      <Comment padding={0} text="Advanced Settings of Opyn v2" />
      <br />
      <br />
      <Row>
        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Oracle"
            description="Oracle status"
            icon={<IconCoin size="large" />}
            onClick={() => {
              history.push('/protocol/oracle/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="OTokens"
            description="List of oTokens"
            icon={<IconMenu size="large" />}
            onClick={() => {
              history.push('/protocol/otokens/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Factory"
            description="Create new options"
            icon={
              <img style={{ height: 55 }} src={theme._name === 'dark' ? factoryWhite : factoryBlack} alt="factory" />
            }
            onClick={() => {
              history.push('/protocol/factory/')
            }}
          />
        </Col>

        <Col sm={12} md={6} lg={4}>
          <BoxButton
            title="Faucet"
            description="Mint testnet tokens"
            icon={<img style={{ height: 55 }} src={theme._name === 'dark' ? dripWhite : dripBlack} alt="faucet" />}
            onClick={() => {
              history.push('/protocol/faucet/')
            }}
          />
        </Col>
      </Row>
    </StyledContainer>
  )
}

export default ProtocolPage
