import React from 'react'
import { LinkBase } from '@aragon/ui'

export const onclickWrapper = (child: any, onClick: any) => {
  return <LinkBase onClick={onClick}> {child} </LinkBase>
}

export const green = text => {
  return <div style={{ color: '#7aae1a' }}> {text} </div>
}

export const red = text => {
  return <div style={{ color: '#da5750' }}> {text} </div>
}

export const bold = text => {
  return <div style={{ fontWeight: 'bolder' }}> {text} </div>
}
