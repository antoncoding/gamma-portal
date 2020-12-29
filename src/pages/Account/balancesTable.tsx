import React, { useCallback, useMemo } from 'react'
import { DataView, Button, useToast } from '@aragon/ui'
import SectionTitle from '../../components/SectionHeader'
import OpynTokenAmount from '../../components/OpynTokenAmount'
import { useOTokenBalances } from '../../hooks/useOTokenBalances'

import { useConnectedWallet } from '../../contexts/wallet'
import { OTokenBalance } from '../../types'
import { sortByExpiryThanStrike, isExpired } from '../../utils/others'

import { Controller } from '../../utils/contracts/controller'
import { OTOKENS } from '../../constants/dataviewContents'

import BigNumber from 'bignumber.js'

export default function AccountBalances({ account }: { account: string }) {
  const { networkId, web3, user } = useConnectedWallet()

  const toast = useToast()

  const { balances, isLoading: isLoadingBalance } = useOTokenBalances(account, networkId)

  const redeemToken = useCallback(
    async (token: string, amount: BigNumber) => {
      if (user !== account) {
        toast('Connected account is not the owner.')
        return
      }
      const controller = new Controller(web3, networkId, user)
      await controller.redeemBatch(user, [token], [amount])
    },
    [web3, networkId, user, account, toast],
  )

  const entries = useMemo(() => (balances ? balances : []), [balances])

  const renderRow = useCallback(
    (balance: OTokenBalance) => {
      const expired = isExpired(balance.token)
      const button = expired ? (
        <Button label="Redeem" onClick={() => redeemToken(balance.token.id, balance.balance)} />
      ) : (
        <Button label="Trade" onClick={() => toast('Coming soon')} />
      )
      return [
        <OpynTokenAmount chainId={networkId} token={balance.token} amount={balance.balance.toString()} />,
        '-',
        button,
      ]
    },
    [networkId, redeemToken, toast],
  )

  return (
    <>
      <SectionTitle title="Balances" />
      <DataView
        status={isLoadingBalance ? 'loading' : 'default'}
        fields={['balance', 'PnL', '']}
        emptyState={OTOKENS}
        entries={entries.sort((a, b) => sortByExpiryThanStrike(a.token, b.token)) || []}
        renderEntry={renderRow}
      />
    </>
  )
}
