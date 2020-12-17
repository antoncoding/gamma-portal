import React from 'react'
import { useHistory } from 'react-router-dom'
import { IconSettings, LinkBase } from '@aragon/ui'

function Settings() {
  const history = useHistory()

  return (
    <LinkBase style={{ paddingLeft: 10, paddingTop: 5 }} onClick={() => history.push('/settings/')}>
      <IconSettings />
    </LinkBase>
  )
}

export default Settings
