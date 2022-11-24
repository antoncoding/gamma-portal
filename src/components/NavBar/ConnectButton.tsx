import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, IconConnect, Box, IconPower, IdentityBadge } from '@aragon/ui'

import { checkAddressAndAddToStorage } from '../../utils/storage'
import { useConnectedWallet } from '../../contexts/wallet'
import { useENS } from '../../hooks/useENS'

function ConnectButton() {
  const { connect, disconnect, user } = useConnectedWallet()

  const { ensName } = useENS()

  const connectWeb3 = async () => {
    const address = await connect()
    if (!address) return
    checkAddressAndAddToStorage(address)
  }

  const history = useHistory()

  return user !== '' ? (
    <>
      <Box padding={6}>
        <IdentityBadge
          label={ensName ? ensName : undefined}
          entity={user}
          popoverAction={{
            label: (
              <>
                <IconPower></IconPower> Disconnect{' '}
              </>
            ),
            onClick: () => {
              disconnect()
              history.push('/account')
            },
          }}
        />
      </Box>
    </>
  ) : (
    <Button mode="normal" icon={<IconConnect />} label="Connect" onClick={connectWeb3} />
  )
}

export default ConnectButton
