import React from 'react'
import { useHistory } from 'react-router-dom'

import { Header, Box, LinkBase, Tag, IconCopy, IconSwap } from '@aragon/ui'

import Comment from '../../components/Comment'

function TradePage() {
  // const theme = useTheme()
  const history = useHistory()

  return (
    <>
      <Header primary="Trade" />
      <Comment text="Buy / Sell oTokens" />
      <div style={{ padding: 5, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%' }}>
          <MainButton
            title="Swap"
            description="Simple swap between oToken and USDC"
            icon={<IconSwap size="large" />}
            onClick={() => {
              history.push('/trade/swap/')
            }}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="Orderbook"
            description="Advanced trading venue"
            icon={<IconCopy size="large" />}
            onClick={() => {
              history.push('/trade/orderbook/')
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

export default TradePage
