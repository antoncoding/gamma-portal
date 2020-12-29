import React from 'react'

import SectionTitle from '../../components/SectionHeader'

import { RadioList } from '@aragon/ui'
import { subgraph } from '../../constants/endpoints'
import { useConnectedWallet } from '../../contexts/wallet'
import { SupportedNetworks } from '../../constants/networks'

const items = [
  {
    title: 'Mainnet',
    description: `Subgraph endpoint: ${subgraph[SupportedNetworks.Mainnet]}`,
  },
  {
    title: 'Kovan',
    description: `Subgraph endpoint: ${subgraph[SupportedNetworks.Kovan]}`,
  },
]

const networkIdToIdx = {
  1: 0,
  42: 1,
}

function Network() {
  const { networkId } = useConnectedWallet()

  const selectedIdx = networkIdToIdx[networkId]

  return (
    <>
      <SectionTitle title="Network" />
      <div style={{ display: 'flex' }}>
        <RadioList title={'Network Settings'} items={items} selected={selectedIdx} />
      </div>
    </>
  )
}

export default Network
