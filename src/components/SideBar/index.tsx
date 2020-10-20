import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTheme, IconHome, IconUser } from '@aragon/ui'
import SidebarTitle from './SidebarTitle'
import SubButton from './SubButton'

export default function SideBar() {
  const theme = useTheme()
  const history = useHistory()

  const defaultSelectedTab =
    history.location.pathname === '/' ? 1 :
      history.location.pathname.includes('/account/') ? 2 :
        -1
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab)
  const [subSelected, setSubSelected] = useState('')

  return (
    <div style={{ backgroundColor: theme.surface, height: '100%', width: '100%', borderRight: '1px solid', borderColor: theme.border }}>
      <div style={{ paddingTop: '5%' }}>
        <SidebarTitle
          title="Home"
          icon={<IconHome />}
          onClick={() => {
            history.push('/')
            setSelectedTab(1)
          }
          }
          isSelected={selectedTab === 1}
        />
        <SidebarTitle
          title="Account"
          icon={<IconUser />}
          onClick={() => {
            history.push('/account/')
            setSelectedTab(2)}
          }
          isSelected={selectedTab === 2}
        />
        <SubButton
          title="Operators"
          icon={<IconUser />}
          onClick={() => {
            history.push('/operators/')
            setSubSelected('operators')
          }}
          isSelected={selectedTab === 2 &&  subSelected === 'operator'}
          shown={selectedTab === 2}
        />
      </div>
    </div>
  )
}