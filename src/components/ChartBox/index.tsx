import React from 'react'

import { Box, LinkBase } from '@aragon/ui'

type CharBoxProps = {
  title: string
  description: string
  children: React.ReactChild
  onClickDescription?: Function
}

export function ChartBox({ title, description, children, onClickDescription = () => {} }: CharBoxProps) {
  return (
    <LinkBase>
      <Box>
        <div style={{ fontSize: 18, paddingBottom: 20 }}>{title}</div>
        {children}
        <div style={{ paddingTop: 14, opacity: 0.5 }}>
          {' '}
          <span onClick={onClickDescription as any}> {description} </span>{' '}
        </div>
      </Box>
    </LinkBase>
  )
}

export default ChartBox
