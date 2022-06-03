import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Row, Col } from 'react-grid-system'
import BoxButton from '../../components/BoxButton'
import Header from '../../components/Header'
import StyledContainer from '../../components/StyledContainer'
import { IconGroup } from '@aragon/ui'

import Comment from '../../components/Comment'

function TradePage() {
  const history = useHistory()
  useEffect(() => {
    ReactGA.pageview('/trade/')
  }, [])
  return (
    <StyledContainer>
      <Header primary="Trade" />
      <Comment padding={0} text="Trade oTokens with 0x protocol!" />
      <br />
      <br />

      <>
        <Row>
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

          <div style={{ width: '30%', marginLeft: '3%' }}></div>
        </Row>
      </>
    </StyledContainer>
  )
}

export default TradePage
