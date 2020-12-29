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
        <RadioList
          title={'Switch between networks'}
          items={items}
          selected={selectedIdx}
          // onChange={(selectedIdx: number) => {
          //   const newNetworkId = idxToNetworkId[selectedIdx]
          //   setSelectedIdx(selectedIdx)
          //   // const newNetworkId = checked ? 4 : 1
          //   handleNetworkChange(newNetworkId)
          //   storePreference('networkId', newNetworkId.toString())
          //   // window.location.reload()
          // }}
        />
      </div>
    </>
  )
}

export default Network
