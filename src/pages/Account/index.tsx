import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import Header from '../../components/Header'
import { useParams } from 'react-router-dom'
import L1Balances from './L1Wallet'

export default function Account() {
  const { account } = useParams()
  useEffect(() => {
    ReactGA.pageview('/account/')
  }, [])
  return (
    <>
      <Header primary="Account Overview" />
      <L1Balances account={account} />
    </>
  )
}
