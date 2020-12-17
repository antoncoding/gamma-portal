import React from 'react'
import { Header } from '@aragon/ui'
import { useParams } from 'react-router-dom'
import BalanceDataView from './balancesTable'
export default function Account() {
  const { account } = useParams()

  return (
    <>
      <Header primary="Account Overview" />
      <BalanceDataView account={account} />
    </>
  )
}
