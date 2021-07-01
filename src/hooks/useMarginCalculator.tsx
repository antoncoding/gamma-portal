/* eslint-disable react-hooks/exhaustive-deps */
import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import { toTokenAmount } from '../utils/math'
import { useConnectedWallet } from '../contexts/wallet'
import { addresses, EthSpotShock, timeLeftToPT } from '../constants'
const calculatorAbi = require('../constants/abis/marginCalculator.json')

const useMarginCalculator = () => {
  const { web3, networkId } = useConnectedWallet()

  const calculator = useMemo(() => new web3.eth.Contract(calculatorAbi, addresses[networkId].calculator), [networkId])

  const getNakedMarginRequired = useCallback(
    async (
      underlying: string,
      strikeAsset: string,
      collateral: string,
      shortAmount: BigNumber,
      strikePrice: BigNumber,
      underlyingPrice: string,
      shortExpiryTimestamp: number,
      collateralDecimals: number,
      isPut: boolean,
    ) => {
      if (!calculator) return null

      const minCollat = await calculator.methods
        .getNakedMarginRequired(
          underlying,
          strikeAsset,
          collateral,
          shortAmount.toString(),
          strikePrice.toString(),
          underlyingPrice,
          shortExpiryTimestamp,
          collateralDecimals,
          isPut,
        )
        .call()
      return new BigNumber(minCollat.toString())
    },
    [calculator],
  )

  const getMarginRequired = useCallback(
    async (
      oTokenId: string,
      collatAddress: string,
      shortAmount: BigNumber,
      collatAmount: BigNumber,
      collatDecimals: number,
    ) => {
      if (!calculator) return new BigNumber(0)

      const [, requiredMargin]: Array<string> = await calculator.methods
        .getMarginRequired(
          [[oTokenId], [], [collatAddress], [shortAmount.toString()], [], [collatAmount.toString()]],
          1,
        )
        .call()
      return toTokenAmount(new BigNumber(requiredMargin.toString()), collatDecimals)
    },
    [calculator],
  )

  const getLiquidationPrice = useCallback(
    (collatRatio: BigNumber, _isPut: boolean, rawStrikePrice: string, expiry: number) => {
      const strikePrice = toTokenAmount(rawStrikePrice, 8)
      const now = Math.floor(Date.now() / 1000)
      const timeLeft = expiry - now
      const maxPrice = timeLeftToPT(timeLeft)
      const spotShock = new BigNumber(EthSpotShock)
      if (_isPut) {
        if (collatRatio.gt(1)) return new BigNumber(0)
        return strikePrice.times(collatRatio.minus(1)).div(spotShock.times(maxPrice - 1))
      } else {
        if (collatRatio.gt(1)) return new BigNumber(Infinity)
        return strikePrice
          .times(spotShock)
          .times(maxPrice - 1)
          .div(collatRatio.minus(1))
      }
    },
    [],
  )

  return {
    getNakedMarginRequired,
    getMarginRequired,
    getLiquidationPrice,
  }
}

export default useMarginCalculator
