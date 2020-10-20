import React from 'react';

import { Bar } from '@aragon/ui';
import ConnectButton from './ConnectButton';

function MyBar() {

  return (
    <Bar
      style={{ margin: 0 }}
      secondary={
        <>
          <ConnectButton />
        </>
      }
    />

  );
}

export default MyBar;
