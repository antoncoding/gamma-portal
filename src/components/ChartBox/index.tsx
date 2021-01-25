import React from 'react'

import { Box, LinkBase } from '@aragon/ui'

type CharBoxProps = {
  title: string
  description: string
  children: React.ReactChild
  onClick?: Function
  onClickDescription?: Function
}

export function ChartBox({ title, description, children, onClick, onClickDescription = () => {} }: CharBoxProps) {
  return (
    <LinkBase>
      <Box>
        <div style={{ fontSize: 18, paddingTop: 10, paddingBottom: 10 }}>{title}</div>
        {children}
        <div style={{ paddingTop: 10, opacity: 0.5 }}>
          {' '}
          <span onClick={onClickDescription as any}> {description} </span>{' '}
        </div>
      </Box>
    </LinkBase>
  )
}

export default ChartBox
