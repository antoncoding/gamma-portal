import React from 'react'

import SectionTitle from '../../components/SectionHeader'

import { RadioList } from '@aragon/ui'
import { subgraph, networkIdToName } from '../../constants/endpoints'
import { useConnectedWallet } from '../../contexts/wallet'
import { SupportedNetworks } from '../../constants/networks'

const networkKeys = Object.keys(SupportedNetworks).filter(k => isNaN(Number(SupportedNetworks[k])))

const items = networkKeys.map(k => {
  return {
    title: networkIdToName[k],
    description: `Subgraph endpoint: ${subgraph[k]}`,
  }
})

function Network() {
  const { networkId } = useConnectedWallet()

  const selectedIdx = items.findIndex(i => i.title === networkIdToName[networkId])

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
