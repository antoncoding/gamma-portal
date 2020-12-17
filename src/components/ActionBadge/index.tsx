import React from 'react'

import { Tag } from '@aragon/ui'

export default function ActionBadgeFromId({ id }: { id: string }) {
  if (id.includes('DEPOSIT-COLLATERAL')) {
    return DepositCollateralBadge()
  } else if (id.includes('WITHDRAW-COLLATERAL')) {
    return WithdrawCollateralBadge()
  } else if (id.includes('DEPOSIT-LONG')) {
    return DepositLongBadge()
  } else if (id.includes('WITHDRAW-LONG')) {
    return WithdrawLongBadge()
  } else if (id.includes('BURN-SHORT')) {
    return BurnShortBadge()
  } else if (id.includes('MINT-SHORT')) {
    return MintShortBadge()
  } else if (id.includes('SETTLE')) {
    return SettleBadge()
  } else {
    return OtherBadge()
  }
}

export function DepositCollateralBadge() {
  return (
    <Tag color="#004080" background="#b3d9ff" size="normal">
      {' '}
      Deposit Collateral{' '}
    </Tag>
  )
}

export function WithdrawCollateralBadge() {
  return (
    <Tag color="#004080" background="#b3d9ff" size="normal">
      {' '}
      Withdraw Collateral{' '}
    </Tag>
  )
}

export function DepositLongBadge() {
  return (
    <Tag color="#006600" background="#c2f0c2" size="normal">
      {' '}
      Deposit Long{' '}
    </Tag>
  )
}

export function WithdrawLongBadge() {
  return (
    <Tag color="#006600" background="#c2f0c2" size="normal">
      {' '}
      Withdraw Long{' '}
    </Tag>
  )
}

export function MintShortBadge() {
  return (
    <Tag color="#800000" background="#ffb3b3" size="normal">
      {' '}
      Mint Short{' '}
    </Tag>
  )
}

export function BurnShortBadge() {
  return (
    <Tag color="#800000" background="#ffb3b3" size="normal">
      {' '}
      Burn Short{' '}
    </Tag>
  )
}

export function SettleBadge() {
  return (
    <Tag color="#FFC300" background="#FFF8BC" size="normal">
      {' '}
      Settle Vault{' '}
    </Tag>
  )
}

export function OtherBadge() {
  return <Tag size="normal"> Others </Tag>
}
