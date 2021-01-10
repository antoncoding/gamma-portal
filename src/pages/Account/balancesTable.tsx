import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { DataView, Button, useToast } from '@aragon/ui'
import SectionTitle from '../../components/SectionHeader'
import OpynTokenAmount from '../../components/OpynTokenAmount'
import { useOTokenBalances } from '../../hooks/useOTokenBalances'

import { useConnectedWallet } from '../../contexts/wallet'
import { OTokenBalance } from '../../types'
import { sortByExpiryThanStrike, isExpired } from '../../utils/others'

import { OTOKENS } from '../../constants/dataviewContents'

import BigNumber from 'bignumber.js'
import { useController } from '../../hooks/useController'

export default function AccountBalances({ account }: { account: string }) {
  const { networkId, user } = useConnectedWallet()

  const toast = useToast()

  const history = useHistory()

  const { balances, isLoading: isLoadingBalance } = useOTokenBalances(account, networkId)

  const { redeemBatch } = useController()

  const redeemToken = useCallback(
    async (token: string, amount: BigNumber) => {
      if (user !== account) return toast('Connected account is not the owner.')

      await redeemBatch(user, [token], [amount])
    },
    [user, account, toast, redeemBatch],
  )

  const entries = useMemo(() => (balances ? balances : []), [balances])

  const renderRow = useCallback(
    (balance: OTokenBalance) => {
      const expired = isExpired(balance.token)
      const button = expired ? (
        <Button label="Redeem" onClick={() => redeemToken(balance.token.id, balance.balance)} />
      ) : (
        <Button label="Trade" onClick={() => history.push(`/trade/swap/${balance.token.id}`)} />
      )
      return [
        <OpynTokenAmount chainId={networkId} token={balance.token} amount={balance.balance.toString()} />,
        '-',
        button,
      ]
    },
    [networkId, redeemToken, history],
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
