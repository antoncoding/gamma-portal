import React, { useContext, useState } from 'react'
import { Header, useToast } from '@aragon/ui'
import SectionTitle from '../../components/SectionHeader'
import { useOTokenBalances } from '../../hooks/useOTokenBalances'
import { useParams } from 'react-router-dom';
import { walletContext } from '../../contexts/wallet'
import BalanceDataView from './balancesTable'
export default function Account() {

  const { account } = useParams()
  const { networkId } = useContext(walletContext)

  return (
    <>
      <Header primary="Account Overview" />
      <BalanceDataView account={account} />
    </>
  )
}