import React, { useState } from 'react';

import SectionTitle from '../../components/SectionHeader'

import { Switch } from '@aragon/ui'
import { storePreference } from '../../utils/storage'

import { useConnection } from '../../hooks/useConnection'

function Network() {

  const { networkId, setNetworkId } = useConnection()

  const [isTestnet, setIsTestnet] = useState(networkId === 4)

  return (
    <>
      <SectionTitle title="Network" />
      <div style={{display: 'flex'}}>
        <div style={{ paddingBottom: 10, paddingRight: 45 }}> Testnet </div>
        <div style={{ paddingTop: 3 }}> <Switch disabled checked={isTestnet} onChange={(checked) => {
          setIsTestnet(checked)
          const newNetworkId = checked ? 4 : 1
          setNetworkId(newNetworkId)
          storePreference('networkId', newNetworkId.toString())
          window.location.reload()
        }} /> </div>
      </div>
    </>
  );
}

export default Network;
