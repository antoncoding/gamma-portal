import React, { useContext, useMemo, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom';

import { DataView, useToast, Timer } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'

import { getVaultHistory } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'

import {DepositCollateralBadge, WithdrawCollateralBadge} from '../../components/ActionBadge'

import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function VaultHistory() {

  const [isLoading, setIsLoading] = useState(true)

  const { web3, networkId, user } = useContext(walletContext)
  const { owner, vaultId } = useParams()
  const toast = useToast()

  const history = useAsyncMemo(async () => {
    const { burnShortActions, depositCollateralActions, depositLongActions, mintShortActions, withdrawCollateralActions, withdrawLongActions } = await getVaultHistory(networkId, owner, vaultId, toast)
    const allEntry = [...burnShortActions, ...depositCollateralActions, ...depositLongActions, ...mintShortActions, ...withdrawCollateralActions, ...withdrawLongActions]
      .sort((a, b) => a.timestamp >= b.timestamp ? -1 : 1)
    setIsLoading(false)
    return allEntry
  }, [], [])

  console.log(`history`, history)

  const renderRow = useCallback((entry: {oToken: undefined | {id: string, symbol:string }, asset:string, amount:string}) => {
    const badge = <WithdrawCollateralBadge />
    const asset = entry.oToken
      ? <CustomIdentityBadge entity={entry.oToken.id} label={entry.oToken.symbol} /> 
      : <CustomIdentityBadge entity={entry.asset} label="now" />
    
    return [
      badge,

    ]
  }, [])

  return (
    <>

      <SectionTitle title={'History'} />
      {/* <DataView
        mode="table"
        status={isLoading ? 'loading' : 'default'}
        fields={['type', 'asset', 'amount', 'timestamp']}
      /> */}
    </>
  )
}
