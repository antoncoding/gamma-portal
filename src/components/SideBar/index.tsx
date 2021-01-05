import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTheme, IconHome, IconUser, IconConfiguration, LinkBase } from '@aragon/ui'
import SidebarTitle from './SidebarTitle'
import SubButton from './SubButton'

import { useConnectedWallet } from '../../contexts/wallet'

const hash = process.env.REACT_APP_VERSION || '0x00'

export default function SideBar() {
  const theme = useTheme()
  const history = useHistory()

  history.listen(location => {
    setSelectedTab(locationToTabId(location))
    setSelectedSubButton(locationToSubButtomId(location))
  })

  const { user, readOnlyUser } = useConnectedWallet()

  const defaultSelectedTab = locationToTabId(history.location)

  const defaultSubTab = locationToSubButtomId(history.location)

  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab)
  const [subSelected, setSelectedSubButton] = useState(defaultSubTab)

  return (
    <div
      style={{
        backgroundColor: theme.surface,
        height: '100%',
        width: '100%',
        borderRight: '1px solid',
        borderColor: theme.border,
      }}
    >
      <div style={{ paddingTop: '5%' }}>
        <SidebarTitle
          title="Home"
          icon={<IconHome />}
          onClick={() => {
            history.push('/')
            setSelectedTab(1)
          }}
          isSelected={selectedTab === 1}
        />
        <SidebarTitle
          title="Account"
          icon={<IconUser />}
          onClick={() => {
            history.push('/account/')
            setSelectedTab(2)
          }}
          isSelected={selectedTab === 2}
        />
        <SubButton
          title="Operators"
          onClick={() => {
            history.push(`/account/${user ? user : readOnlyUser}/operators/`)
          }}
          isSelected={selectedTab === 2 && subSelected === 'operators'}
          shown={selectedTab === 2}
        />
        <SubButton
          title="Vaults"
          onClick={() => {
            history.push(`/account/${user ? user : readOnlyUser}/vaults/`)
          }}
          isSelected={selectedTab === 2 && subSelected === 'vaults'}
          shown={selectedTab === 2}
        />
        <SidebarTitle
          title="Protocol"
          icon={<IconConfiguration />}
          onClick={() => {
            history.push('/portocol/')
          }}
          isSelected={selectedTab === 3}
        />
        <SubButton
          title="Factory"
          onClick={() => {
            history.push(`/portocol/factory/`)
          }}
          isSelected={selectedTab === 3 && subSelected === 'factory'}
          shown={selectedTab === 3}
        />
        <SubButton
          title="Oracle"
          onClick={() => {
            history.push(`/portocol/oracle/`)
          }}
          isSelected={selectedTab === 3 && subSelected === 'oracle'}
          shown={selectedTab === 3}
        />
        {/* <SidebarTitle
          title="Trade"
          icon={<IconSwap />}
          onClick={() => {
            history.push('/trade/')
          }}
          isSelected={selectedTab === 4}
        /> */}
        <SubButton
          title="Swap"
          onClick={() => {
            history.push(`/trade/swap/`)
          }}
          isSelected={selectedTab === 4 && subSelected === 'swap'}
          shown={selectedTab === 4}
        />
        <SubButton
          title="Orderbook"
          onClick={() => {
            history.push(`/trade/orderbook/`)
          }}
          isSelected={selectedTab === 4 && subSelected === 'orderbook'}
          shown={selectedTab === 4}
        />
      </div>
      <div
        style={{
          color: theme.contentSecondary,
          padding: '10px',
          position: 'fixed',
          bottom: '0px',
        }}
      >
        Commit Hash{' '}
        <LinkBase external href={`https://github.com/antoncoding/opyn-v2-portal/commit/${hash}`}>
          {' '}
          {hash}{' '}
        </LinkBase>
      </div>
    </div>
  )
}

function locationToTabId(location) {
  return location.pathname === '/'
    ? 1
    : location.pathname.includes('/account/')
    ? 2
    : location.pathname.includes('/portocol/')
    ? 3
    : location.pathname.includes('/trade/')
    ? 4
    : -1
}

function locationToSubButtomId(location) {
  return location.pathname.includes('/operators/')
    ? 'operators'
    : location.pathname.includes('/vaults/')
    ? 'vaults'
    : location.pathname.includes('/factory/')
    ? 'factory'
    : location.pathname.includes('/oracle/')
    ? 'oracle'
    : location.pathname.includes('/swap/')
    ? 'swap'
    : location.pathname.includes('/orderbook/')
    ? 'orderbook'
    : ''
}
