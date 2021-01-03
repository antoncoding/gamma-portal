import React from 'react'
import LabelText from '../LabelText'

type Props = {
  label: string
  amount: string
  symbol: string
}
export default function TokenBalanceEntry({ label, amount, symbol }: Props) {
  return (
    <div style={{ display: 'flex', paddingTop: '5px' }}>
      <LabelText label={label} minWidth={'150px'} />
      <div style={{ paddingRight: '5px' }}>{amount}</div> <div style={{ opacity: 0.7 }}>{symbol}</div>
    </div>
  )
}
