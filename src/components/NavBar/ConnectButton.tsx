import React from 'react';

import {
  Button, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import CustomIdentityBadge from '../CustomIdentityBadge'

import { checkAddressAndAddToStorage } from '../../utils/storage';
import {useConnection} from '../../hooks/useConnection'

function ConnectButton() {

  const {connect, disconnect, user} = useConnection()

  const connectWeb3 = async () => {
    const address = await connect();
    if (address === false) return;
    console.log(`checkAddressAndAddToStorage`, address)
    checkAddressAndAddToStorage(address);
  };

  return user !== '' ? (
    <>
      <div style={{ paddingTop: 5, paddingRight: 5 }}>
        <LinkBase onClick={disconnect} size="small">
          {' '}
          <IconPower />
          {' '}
        </LinkBase>
      </div>
      <Box padding={6}>
        <CustomIdentityBadge entity={user} shorten={true} />
      </Box>

    </>
  ) : (
    <Button icon={<IconConnect />} label="Connect" onClick={connectWeb3} />
  );
}


export default ConnectButton;
