import React from 'react'

import { Box, LinkBase, Tag } from '@aragon/ui'

type BoxButtonProps = {
  title: string
  description: string
  icon: any
  onClick: Function
  tag?: string
}

export function BoxButton({ title, description, icon, onClick, tag }: BoxButtonProps) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%', paddingBottom: 20 }}>
      <Box>
        <div style={{ fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
        </div>
        {icon}
        <div style={{ paddingTop: 5, opacity: 0.5 }}> {description} </div>
      </Box>
    </LinkBase>
  )
}

export default BoxButton
