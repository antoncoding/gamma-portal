import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useTheme, IconHome, IconUser, IconCirclePlus } from '@aragon/ui'
import SidebarTitle from './SidebarTitle'
import SubButton from './SubButton'

import { walletContext } from '../../contexts/wallet'

export default function SideBar() {
  const theme = useTheme()
  const history = useHistory()

  history.listen((location,) => {
    setSelectedTab(locationToTabId(location))
    setSelectedSubButton(locationToSubButtomId(location))
  })

  const { user, readOnlyUser } = useContext(walletContext)

  const defaultSelectedTab = locationToTabId(history.location)
  
  const defaultSubTab = locationToSubButtomId(history.location)

  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab)
  const [subSelected, setSelectedSubButton] = useState(defaultSubTab)

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
            setSelectedTab(2)
          }
            
          }
          isSelected={selectedTab === 2}
        />
        <SubButton
          title="Operators"
          onClick={() => {
            history.push(`/account/${user ? user : readOnlyUser}/operators/`)
          }}
          isSelected={selectedTab === 2 &&  subSelected === 'operators'}
          shown={selectedTab === 2}
        />
        <SubButton
          title="Vaults"
          onClick={() => {
            history.push(`/account/${user ? user : readOnlyUser}/vaults/`)
          }}
          isSelected={selectedTab === 2 &&  subSelected === 'vaults'}
          shown={selectedTab === 2}
        />
        <SidebarTitle
          title="Create Option"
          icon={<IconCirclePlus />}
          onClick={() => {
            history.push('/create/')
          }
          }
          isSelected={selectedTab === 3}
        />
      </div>
    </div>
  )
}

function locationToTabId (location) {
  return  location.pathname === '/' ? 1 :
  location.pathname.includes('/account/') ? 2 :
  location.pathname === '/create/' ? 3 :
    -1
}

function locationToSubButtomId(location) {
  return  location.pathname.includes('/operators/') ? 'operators' : 
    location.pathname.includes('/vaults/') ? 'vaults' : ''
}