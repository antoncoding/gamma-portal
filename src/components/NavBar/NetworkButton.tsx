import React, { useState, useCallback } from 'react'

import { Button, Modal, useTheme } from '@aragon/ui'

import { useConnectedWallet } from '../../contexts/wallet'
import { isMainnet, networkIdToName, networkToLogo, SupportedNetworks } from '../../constants'
import SectionTitle from '../SectionHeader'
import { switchNetwork } from '../../utils/others'

const networkKeys = Object.keys(SupportedNetworks).filter(k => isNaN(Number(SupportedNetworks[k])))

const items = networkKeys.map(k => {
  return {
    id: parseInt(k),
    title: networkIdToName[k],
    logo: networkToLogo[k],
  }
})

function NetworkButton() {
  const { networkId, isWatchMode, setNetworkId } = useConnectedWallet()

  const [opened, setOpened] = useState(false)

  const theme = useTheme()

  const onClick = useCallback(_networkId => {
    // if is connected to a wallet, send request to update network
    if (!isWatchMode) {
      switchNetwork((window as any).ethereum, _networkId)
    } else {
      setNetworkId(_networkId)
    }
    
  }, [isWatchMode, setNetworkId])

  return (
    <div>
      <Button
        label="test"
        display="icon"
        icon={<img src={networkToLogo[networkId]} height={30} alt="logo" style={{ borderRadius: 10 }} />}
        onClick={() => {
          setOpened(true)
        }}
      />
      <Modal visible={opened} onClose={() => setOpened(false)} padding={30}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '3%' }}>
          <SectionTitle title="Change Network" />
        </div>

        {items
          .filter(i => isMainnet[i.id])
          .map(i => {
            return (
              <div
                key={i.id}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  icon={<img src={i.logo} height={30} alt={i.title} />}
                  label={i.title}
                  style={{ minWidth: 300 }}
                  mode={networkId === i.id ? 'strong' : 'normal'}
                  onClick={() => onClick(i.id)}
                />
              </div>
            )
          })}

        <br />
        {/* testnets */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '3%' }}>
          <div style={{ color: theme.contentSecondary, fontSize: 17 }}> Testnets </div>
        </div>
        {items
          .filter(i => !isMainnet[i.id])
          .map(i => {
            return (
              <div
                key={i.id}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  label={i.title}
                  style={{ minWidth: 300 }}
                  mode={networkId === i.id ? 'strong' : 'normal'}
                  onClick={() => onClick(i.id)}
                />
              </div>
            )
          })}
        <br />
      </Modal>
    </div>
  )
}

export default NetworkButton
