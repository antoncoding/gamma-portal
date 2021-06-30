/* eslint-disable react-hooks/exhaustive-deps */
import BigNumber from 'bignumber.js'
import { useCallback, useMemo } from 'react'

import { toTokenAmount } from '../utils/math'
import { useConnectedWallet } from '../contexts/wallet'
import { addresses } from '../constants'
const calculatorAbi = require('../constants/abis/marginCalculator.json')

type vaultDetail = {
  underlying: string
  strikeAsset: string
  collateral: string
  shortAmount: BigNumber
  strikePrice: BigNumber
  underlyingPrice: string
  shortExpiryTimestamp: number
  collateralDecimals: number
  isPut: boolean
}

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

  const getCollateralDust = useCallback(
    async (collateral: string, collateralDecimals: number) => {
      if (!calculator) return null
      const dustAmount = await calculator.methods.getCollateralDust(collateral).call()
      return toTokenAmount(new BigNumber(dustAmount.toString()), collateralDecimals)
    },
    [calculator],
  )

  const getTimesToExpiry = useCallback(
    async (underlying: string, strikeAsset: string, collateral: string, isPut: boolean) => {
      if (!calculator) return []
      return (
        await calculator.methods.getTimesToExpiry(underlying, strikeAsset, collateral, isPut)
      ).call() as Array<any>
    },
    [calculator],
  )

  const getSpotShock = useCallback(
    async (underlying: string, strikeAsset: string, collateral: string, isPut: boolean) => {
      if (!calculator) return new BigNumber(0)
      const shockAmount = await calculator.methods.getSpotShock(underlying, strikeAsset, collateral, isPut).call()
      return toTokenAmount(new BigNumber(shockAmount.toString()), 27)
    },
    [calculator],
  )

  const getMaxPrice = useCallback(
    async (
      underlying: string,
      strikeAsset: string,
      collateral: string,
      isPut: boolean,
      shortExpiryTimestamp: number,
      _timesToExpiry,
    ) => {
      if (!calculator) return new BigNumber(0)
      let timeToExpiry = shortExpiryTimestamp - Date.now() / 1000
      timeToExpiry = _timesToExpiry.find((time: BigNumber) => time.toNumber() > timeToExpiry)
      if (!timeToExpiry) return new BigNumber(0)
      const maxPrice = await calculator.methods
        .getMaxPrice(underlying, strikeAsset, collateral, isPut, timeToExpiry)
        .call()
      return toTokenAmount(new BigNumber(maxPrice.toString()), 27)
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
    (collatPercent: number, _isPut: boolean, _strikePrice: BigNumber, _maxPrice: BigNumber, _spotShock: BigNumber) => {
      let _liqPrice = new BigNumber(0)
      if (_isPut) {
        _liqPrice = _strikePrice
          .multipliedBy(collatPercent / 100 - 1)
          .dividedBy(_spotShock.multipliedBy(_maxPrice.minus(1)))
      } else {
        if (collatPercent < 100) {
          _liqPrice = _strikePrice
            .multipliedBy(_spotShock)
            .multipliedBy(_maxPrice.minus(1))
            .div(collatPercent / 100 - 1)
        }
      }
      return _liqPrice
    },
    [],
  )

  const getSpotPercent = useCallback(
    (
      collatPercent: number,
      _underlyingPrice: BigNumber,
      _isPut: boolean,
      _strikePrice: BigNumber,
      _maxPrice: BigNumber,
      _spotShock: BigNumber,
    ) => {
      let _liqPrice = getLiquidationPrice(collatPercent, _isPut, _strikePrice, _maxPrice, _spotShock)
      const _spotPercent = new BigNumber(_liqPrice).dividedBy(_underlyingPrice).minus(1).multipliedBy(100)
      return _spotPercent.integerValue(BigNumber.ROUND_CEIL).toNumber()
    },
    [getLiquidationPrice],
  )

  const getNakedMarginVariables = useCallback(
    async (props: vaultDetail) => {
      const {
        underlying,
        strikeAsset,
        collateral,
        shortAmount,
        strikePrice,
        underlyingPrice,
        shortExpiryTimestamp,
        collateralDecimals,
        isPut,
      } = props

      const _marginRequired = await getNakedMarginRequired(
        underlying,
        strikeAsset,
        collateral,
        shortAmount,
        strikePrice,
        underlyingPrice,
        shortExpiryTimestamp,
        collateralDecimals,
        isPut,
      )

      const _dustRequired = await getCollateralDust(collateral, collateralDecimals)

      const _timesToExpiry = await getTimesToExpiry(underlying, strikeAsset, collateral, isPut)

      const _spotShock = await getSpotShock(underlying, strikeAsset, collateral, isPut)

      const _maxPrice = await getMaxPrice(
        underlying,
        strikeAsset,
        collateral,
        isPut,
        shortExpiryTimestamp,
        _timesToExpiry,
      )

      return {
        marginRequired: _marginRequired,
        dustRequired: _dustRequired,
        timesToExpiry: _timesToExpiry,
        spotShock: _spotShock,
        maxPrice: _maxPrice,
      }
    },
    [getNakedMarginRequired, getTimesToExpiry, getSpotShock, getMaxPrice],
  )

  return {
    getNakedMarginRequired,
    getMarginRequired,
    getMaxPrice,
    getSpotPercent,
    getLiquidationPrice,
    getNakedMarginVariables,
  }
}

export default useMarginCalculator
