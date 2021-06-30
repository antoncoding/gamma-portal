import React from 'react'
import { LinkBase } from '@aragon/ui'

export const onclickWrapper = (child: any, onClick: any) => {
  return <LinkBase onClick={onClick}> {child} </LinkBase>
}

export const green = text => {
  return <div style={{ color: '#7aae1a', fontSize: 14 }}> {text} </div>
}

export const red = text => {
  return <div style={{ color: '#da5750', fontSize: 14 }}> {text} </div>
}

export const bold = text => {
  return <div style={{ fontWeight: 'bolder', fontSize: 15 }}> {text} </div>
}

export const regular = text => {
  return <div style={{ fontSize: 14 }}> {text} </div>
}

export function secondary(text) {
  return <div style={{ opacity: 0.7 }}> {text} </div>
}
