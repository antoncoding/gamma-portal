import { BigNumber } from 'bignumber.js'
import { useState, useEffect } from 'react'
import { useConnectedWallet } from '../contexts/wallet'
import { useCustomToast } from './useCustomToast'
import useAsyncMemo from './useAsyncMemo'
import { getNonEmptyPartialCollatVaults } from '../utils/graph'
import { getLastRoundId, dumbCheckIsLiquidatable } from '../utils/liquidation'
import { SubgraphVault, SubgraphOToken } from '../types'
import useMarginCalculator from './useMarginCalculator'

/**
 * get latest roundId
 * get list of vaults using partial collat, associate with "is liquidatable boolean"
 */
export const useLiquidationStatus = (underlying, refetchIntervalSec: number) => {
  const toast = useCustomToast()
  const [isSyncing, setIsSyncing] = useState(true)

  const [latestRoundId, setLatestRound] = useState('0')
  const [underlyingPrice, setUnderlyingPrice] = useState('0')

  const [rawVaults, setRawVaults] = useState<SubgraphVault[]>([])
  const { networkId, web3 } = useConnectedWallet()

  const { getNakedMarginRequired } = useMarginCalculator()

  useEffect(() => {
    let isCancelled = false

    async function updateRoundId() {
      const { latestAnswer, latestRoundId } = await getLastRoundId(web3, networkId)
      if (!isCancelled) {
        setLatestRound(latestRoundId)
        setUnderlyingPrice(latestAnswer)
      }
    }
    setIsSyncing(true)
    updateRoundId()
    const id = setInterval(updateRoundId, refetchIntervalSec * 1000)

    // cleanup function: remove interval
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [refetchIntervalSec, networkId, web3])

  // fetch vaults
  useEffect(() => {
    let isCancelled = false
    async function refetchVaults() {
      setIsSyncing(true)
      const vaults = await getNonEmptyPartialCollatVaults(networkId, toast.error)
      if (!isCancelled) {
        setRawVaults(vaults)
      }
      setIsSyncing(false)
    }
    refetchVaults()
    const id = setInterval(refetchVaults, refetchIntervalSec * 1000)
    // cleanup function
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [refetchIntervalSec, networkId, toast.error])

  // attach isLiquidatable on each row
  const vaults = useAsyncMemo(
    async () => {
      setIsSyncing(true)
      const result = ((await Promise.all(
        rawVaults.map(async vault => {
          const short = vault.shortOToken as SubgraphOToken
          const collateralAmount = vault.collateralAmount as string
          const minCollateral = await getNakedMarginRequired(
            short.underlyingAsset.id,
            short.strikeAsset.id,
            short.collateralAsset.id,
            new BigNumber(vault.shortAmount as string),
            new BigNumber(short.strikePrice),
            underlyingPrice,
            parseInt(short.expiryTimestamp),
            short.collateralAsset.decimals,
            short.isPut,
          )
          const collatRatio =
            minCollateral === null ? new BigNumber(-1) : new BigNumber(collateralAmount).div(minCollateral)

          const { isLiquidatable } = await dumbCheckIsLiquidatable(web3, networkId, vault, latestRoundId)
          return { ...vault, isLiquidatable, minCollateral, collatRatio }
        }),
      )) as any[]).sort((a, b) => (a.collatRatio.gt(b.collatRatio) ? 1 : -1))
      setIsSyncing(false)
      return result
    },
    [],
    [networkId, toast.error, latestRoundId, rawVaults],
  )

  return { vaults, latestRoundId, isSyncing }
}
