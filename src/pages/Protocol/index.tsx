import React from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'

import { Header, Box, LinkBase, Tag, IconCoin, useTheme } from '@aragon/ui'

import Comment from '../../components/Comment'
import factoryBlack from '../../imgs/icons/factory-black.png'
import factoryWhite from '../../imgs/icons/factory-white.png'

function ProtocolPage() {
  const theme = useTheme()
  const history = useHistory()
  ReactGA.pageview('/protocol/')
  return (
    <>
      <Header primary="Protocol" />
      <Comment text="Advanced Settings of Opyn v2" />
      <div style={{ padding: 5, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%' }}>
          <MainButton
            title="Oracle"
            description="Submit Price / See oracle config"
            icon={<IconCoin size="large" />}
            onClick={() => {
              history.push('/portocol/oracle/')
            }}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="Factory"
            description="Create new options"
            icon={
              <img style={{ height: 55 }} src={theme._name === 'dark' ? factoryWhite : factoryBlack} alt="factory" />
            }
            onClick={() => {
              history.push('/portocol/factory/')
            }}
          />
        </div>
        <div style={{ width: '30%', marginLeft: '3%' }}></div>
      </div>
    </>
  )
}

type MainButtonPropx = {
  title: string
  description: string
  icon: any
  onClick: Function
  tag?: string
}

function MainButton({ title, description, icon, onClick, tag }: MainButtonPropx) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%', paddingBottom: 20 }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
        </div>
        {icon}
        <div style={{ paddingTop: 5, opacity: 0.5 }}> {description} </div>
      </Box>
    </LinkBase>
  )
}

export default ProtocolPage
