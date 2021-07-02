import { BigNumber } from 'bignumber.js'
import { useState, useEffect } from 'react'
import { useConnectedWallet } from '../contexts/wallet'
import { useCustomToast } from './useCustomToast'
import useAsyncMemo from './useAsyncMemo'
import { getNonEmptyPartialCollatVaults, getMainnetChainlinkRounds } from '../utils/graph'
import { getMostProfitableRoundId } from '../utils/liquidation'
import { SubgraphVault, SubgraphOToken, ChainlinkRound } from '../types'
import useMarginCalculator from './useMarginCalculator'
import { toTokenAmount, fromTokenAmount } from '../utils/math'
import { useTokenPrice } from './useTokenPrice'

/**
 * get latest roundId
 * get list of vaults using partial collat, associate with "is liquidatable boolean"
 */
export const useLiquidationStatus = (underlying, refetchIntervalSec: number) => {
  const toast = useCustomToast()
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSyncing, setIsSyncing] = useState(true)

  const [rounds, setRounds] = useState<ChainlinkRound[]>([])

  const [rawVaults, setRawVaults] = useState<SubgraphVault[]>([])
  const { networkId } = useConnectedWallet()

  const { getLiquidationPrice } = useMarginCalculator()

  const spotPrice = useTokenPrice(underlying.id, 30)

  useEffect(() => {
    let isCancelled = false
    async function updateRoundsData() {
      const sixHoursBefore = Math.floor(Date.now() / 1000) - 3600 * 6
      const rounds = await getMainnetChainlinkRounds(sixHoursBefore, toast.error)
      if (!isCancelled) {
        setRounds(rounds)
      }
    }
    setIsSyncing(true)
    updateRoundsData()
    const id = setInterval(updateRoundsData, refetchIntervalSec * 1000)
    // cleanup function: remove interval
    return () => {
      isCancelled = true
      clearInterval(id)
    }
  }, [refetchIntervalSec, toast.error])

  // fetch vaults
  useEffect(() => {
    let isCancelled = false
    async function refetchVaults() {
      setIsSyncing(true)
      const vaults = await getNonEmptyPartialCollatVaults(networkId, toast.error)
      if (!isCancelled) {
        setRawVaults(vaults)
      }
      setIsInitializing(true)
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
      const result = rawVaults.map(vault => {
        const short = vault.shortOToken as SubgraphOToken
        const shortAmount = vault.shortAmount as string
        const collateralAmount = vault.collateralAmount as string
        const fullCollateralAmount = short.isPut
          ? fromTokenAmount(
              toTokenAmount(short.strikePrice, 8).times(toTokenAmount(shortAmount, 8)),
              short.collateralAsset.decimals,
            )
          : fromTokenAmount(toTokenAmount(shortAmount, 8), short.collateralAsset.decimals)

        const collatRatio = new BigNumber(collateralAmount).div(fullCollateralAmount)
        const liquidationPrice = getLiquidationPrice(
          collatRatio,
          short.isPut,
          short.strikePrice,
          parseInt(short.expiryTimestamp),
        )

        const { isLiquidatable, round } = getMostProfitableRoundId(
          short,
          collateralAmount,
          shortAmount,
          liquidationPrice,
          rounds,
        )

        return { ...vault, isLiquidatable, collatRatio, liquidationPrice, round }
      })
      setIsSyncing(false)
      return result
    },
    [],
    [networkId, toast.error, rawVaults, rounds],
  )

  return { vaults, isSyncing, isInitializing, spotPrice }
}
