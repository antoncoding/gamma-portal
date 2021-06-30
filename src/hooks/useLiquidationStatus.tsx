import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useConnectedWallet } from '../contexts/wallet'
import { useCustomToast } from './useCustomToast'
import useAsyncMemo from './useAsyncMemo'
import { getNonEmptyPartialCollatVaults } from '../utils/graph'
import { getLastRoundId, dumbCheckIsLiquidatable } from '../utils/liquidation'

/**
 * get latest roundId
 * get list of vaults using partial collat, associate with "is liquidatable boolean"
 */
export const useLiquidationStatus = (refetchIntervalSec: number) => {
  const toast = useCustomToast()
  const { networkId, web3 } = useConnectedWallet()

  const latestRoundId = useAsyncMemo(
    async () => {
      const roundId = getLastRoundId(web3, networkId)
      return roundId
    },
    '0',
    [web3, networkId],
  )

  const rawVaults = useAsyncMemo(
    async () => await getNonEmptyPartialCollatVaults(networkId, toast.error),
    [],
    [networkId, toast.error, latestRoundId],
  )

  const vaults = useAsyncMemo(
    async () => {
      return await Promise.all(
        rawVaults.map(async vault => {
          const { isLiquidatable } = await dumbCheckIsLiquidatable(web3, networkId, vault, latestRoundId)
          return { ...vault, isLiquidatable }
        }),
      )
    },
    [],
    [networkId, toast.error, latestRoundId, rawVaults],
  )

  return { vaults, latestRoundId }
}
