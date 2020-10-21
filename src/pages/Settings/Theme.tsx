import React, { useState } from 'react';

import SectionTitle from '../../components/SectionHeader'

import { Switch } from '@aragon/ui'
import { storePreference, getPreference } from '../../utils/storage'


function ThemeSwitch({ setTheme }: { setTheme: any }) {

  const theme = getPreference('theme', 'light')

  const [isDarkMode, setDarkMode] = useState(theme === 'dark')

  return (
    <>
      <SectionTitle title="Theme" />
      <div style={{display: 'flex'}}>
        <div style={{ paddingRight: 20 }}> Dark Mode </div>
        <div style={{ paddingTop: 3 }}> <Switch checked={isDarkMode} onChange={(checked) => {
          setDarkMode(checked)
          const newMode = checked ? 'dark' : 'light'
          setTheme(newMode)
          storePreference('theme', newMode)
        }} /> </div>
      </div>
    </>
  );
}

export default ThemeSwitch;
