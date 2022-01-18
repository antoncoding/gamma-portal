import React from 'react'

import { Button } from '@aragon/ui'

import { useConnectedWallet } from '../../contexts/wallet'
import { networkToLogo } from '../../constants'

function NetworkButton() {
  const { networkId } = useConnectedWallet()

  return (
    <Button
      mode="normal"
      icon={<img src={networkToLogo[networkId]} height={30} alt="logo" style={{ borderRadius: 10 }} />}
      onClick={() => {}}
    />
  )
}

export default NetworkButton
