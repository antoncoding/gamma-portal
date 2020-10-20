import React, { useContext } from 'react';

import {
  Button, IconConnect, Box, IconPower, IdentityBadge
} from '@aragon/ui';

import { checkAddressAndAddToStorage } from '../../utils/storage';
import { walletContext } from '../../contexts/wallet'

function ConnectButton() {

  const { connect, disconnect, user } = useContext(walletContext)

  const connectWeb3 = async () => {
    const address = await connect();
    if (!address) return;
    checkAddressAndAddToStorage(address);
  };

  return user !== '' ? (
    <>
      <Box padding={6}>
        <IdentityBadge
          entity={user}
          popoverAction={{
            label: <><IconPower></IconPower> Disconnect </>,
            onClick: disconnect
          }}
        />
      </Box>

    </>
  ) : (
      <Button icon={<IconConnect />} label="Connect" onClick={connectWeb3} />
    );
}


export default ConnectButton;
