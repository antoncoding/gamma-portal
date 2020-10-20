import React from 'react';
import { Header } from '@aragon/ui'

import ThemeSwitch from './Theme'
import ClearCache from './ClearCache'

function Settings({ setTheme }: { setTheme: any }) {

  return (
    <>
      <Header primary="Settings" />
      <ThemeSwitch setTheme={setTheme} />
      <br></br>
      <ClearCache />
    </>
  );
}

export default Settings;
