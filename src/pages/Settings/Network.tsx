import React, { useState, useContext } from 'react'

import SectionTitle from '../../components/SectionHeader'

import { RadioList, useToast } from '@aragon/ui'
import { storePreference } from '../../utils/storage'
import { subgraph } from '../../constants/endpoints'
import { walletContext } from '../../contexts/wallet'
import { SupportedNetworks } from '../../constants/networks'

const items = [
  {
    title: 'Mainnet',
    description: `Subgraph endpoint: ${subgraph[SupportedNetworks.Mainnet]}`,
  },
  // {
  //   title: 'Rinkeby',
  //   description: `Subgraph endpoint: ${subgraph[SupportedNetworks.Rinkeby]}`
  // },
  {
    title: 'Kovan',
    description: `Subgraph endpoint: ${subgraph[SupportedNetworks.Kovan]}`,
  },
]

const idxToNetworkId = [1, 42, 4]
const networkIdToIdx = {
  1: 0,
  42: 1,
  // 4: 2,
}

function Network() {
  const toast = useToast()
  const { networkId, setNetworkId } = useContext(walletContext)

  const [selectedIdx, setSelectedIdx] = useState(networkIdToIdx[networkId])

  return (
    <>
      <SectionTitle title="Network" />
      <div style={{ display: 'flex' }}>
        <RadioList
          title={'Switch between networks'}
          items={items}
          selected={selectedIdx}
          onChange={(selectedIdx: number) => {
            const newNetworkId = idxToNetworkId[selectedIdx]
            if (newNetworkId === 1) {
              toast('Mainnet not ready yet!')
              return
            }
            setSelectedIdx(selectedIdx)
            // const newNetworkId = checked ? 4 : 1
            setNetworkId(newNetworkId)
            storePreference('networkId', newNetworkId.toString())
            window.location.reload()
          }}
        />
      </div>
    </>
  )
}

export default Network
