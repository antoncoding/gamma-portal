import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { Container } from 'react-grid-system'
import Header from '../../components/Header'
import { useParams } from 'react-router-dom'
import L1Balances from './L1Wallet'

export default function Account() {
  const { account } = useParams()
  useEffect(() => {
    ReactGA.pageview('/account/')
  }, [])
  return (
    <Container>
      <Header primary="Account Overview" />
      <L1Balances account={account} />
    </Container>
  )
}
