import { useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import BigNumber from 'bignumber.js'
import { useConnectedWallet } from '../contexts/wallet'
import { addresses, ZeroXEndpoint, SupportedNetworks } from '../constants'
import { useNotify } from './useNotify'
import { SignedOrder } from '../types'
import { useGasPrice } from './useGasPrice'
import { useCustomToast } from './useCustomToast'
import { zx_exchange, ZEROX_PROTOCOL_FEE_KEY, FeeTypes } from '../constants'
import { assetDataUtils, signatureUtils, SupportedProvider } from '@0x/order-utils'
import { MetamaskSubprovider } from '@0x/subproviders'
import { getPreference } from '../utils/storage'

const FEE_PERORDER_PER_GWEI = 0.00007
const FEE_RECIPIENT = '0xD325E15A52B780698C45CA3BdB6c49444fe5B588'

const abi = require('../constants/abis/0xExchange.json')

export function use0xExchange() {
  const payWithWeth = useMemo(() => getPreference(ZEROX_PROTOCOL_FEE_KEY, FeeTypes.ETH) === FeeTypes.WETH, [])

  const toast = useCustomToast()
  const { networkId, web3, user } = useConnectedWallet()

  const track = useCallback(
    (action: string) => {
      const label = networkId === SupportedNetworks.Mainnet ? 'mainnet' : 'kovan'
      ReactGA.event({ category: 'trading', action, label })
    },
    [networkId],
  )

  const { notifyCallback } = useNotify()

  const httpEndpoint = useMemo(() => ZeroXEndpoint[networkId].http, [networkId])

  const { fast, fastest } = useGasPrice(5)

  const getGasPriceForOrders = useCallback(
    (orders: SignedOrder[]) => {
      const closestExpiry = Math.min(...orders.map(o => Number(o.expirationTimeSeconds) - Date.now() / 1000))
      return closestExpiry < 120 ? fastest : fast
    },
    [fast, fastest],
  )

  /**
   * If any order is expiring within 2 mins, use fastest
   */
  const getProtocolFee = useCallback(
    (orderInfos: SignedOrder[]) => {
      const gasPrice = getGasPriceForOrders(orderInfos)
      return gasPrice.times(new BigNumber(orderInfos.length)).times(FEE_PERORDER_PER_GWEI)
    },
    [getGasPriceForOrders],
  )

  const createOrder = useCallback(
    async (
      makerAsset: string,
      takerAsset: string,
      makerFeeAsset: string,
      makerAssetAmount: BigNumber,
      takerAssetAmount: BigNumber,
      makerFee: BigNumber,
      expiry: number,
      takerAddress?: string,
    ) => {
      const exchangeAddress = zx_exchange[networkId]
      const salt = BigNumber.random(20)
        .times(new BigNumber(10).pow(new BigNumber(20)))
        .integerValue()
      const order = {
        senderAddress: '0x0000000000000000000000000000000000000000',
        makerAddress: user,
        takerAddress: takerAddress ? takerAddress : '0x0000000000000000000000000000000000000000',
        makerFee: makerFee,
        takerFee: new BigNumber(0),
        makerAssetAmount: makerAssetAmount,
        takerAssetAmount: takerAssetAmount,
        makerAssetData: assetDataUtils.encodeERC20AssetData(makerAsset),
        takerAssetData: assetDataUtils.encodeERC20AssetData(takerAsset),
        salt,
        exchangeAddress,
        feeRecipientAddress: FEE_RECIPIENT,
        expirationTimeSeconds: new BigNumber(expiry).integerValue(),
        makerFeeAssetData: makerFeeAsset ? assetDataUtils.encodeERC20AssetData(makerFeeAsset) : '0x',
        chainId: networkId,
        takerFeeAssetData: '0x',
      }
      track('create-order')
      const provider = new MetamaskSubprovider(web3.currentProvider as SupportedProvider)
      return signatureUtils.ecSignOrderAsync(provider, order, user)
      // return order;
    },
    [networkId, user, web3, track],
  )

  const fillOrders = useCallback(
    async (orders: SignedOrder[], amounts: BigNumber[]) => {
      if (!orders.length) return toast.error('No Orders selected')
      const exchange = new web3.eth.Contract(abi, addresses[networkId].zeroxExchange)

      const signatures = orders.map(order => order.signature)

      const gasPrice = getGasPriceForOrders(orders)
      const feeInEth = getProtocolFee(orders).toString()
      const amountsStr = amounts.map(amount => amount.toString())

      await exchange.methods
        .batchFillOrders(orders, amountsStr, signatures)
        .send({
          from: user,
          value: payWithWeth ? '0' : web3.utils.toWei(feeInEth, 'ether'),
          gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei'),
        })
        .on('transactionHash', notifyCallback)

      track('fill-order')
    },
    [networkId, getProtocolFee, getGasPriceForOrders, notifyCallback, toast, user, web3, track, payWithWeth],
  )

  const fillOrder = useCallback(
    async (order: SignedOrder, amount: BigNumber) => {
      const exchange = new web3.eth.Contract(abi, addresses[networkId].zeroxExchange)

      const signature = order.signature

      const gasPrice = getGasPriceForOrders([order])
      const feeInEth = getProtocolFee([order]).toString()
      const amountStr = amount.toString()

      await exchange.methods
        .fillOrder(order, amountStr, signature)
        .send({
          from: user,
          value: payWithWeth ? '0' : web3.utils.toWei(feeInEth, 'ether'),
          gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei'),
        })
        .on('transactionHash', notifyCallback)
      track('fill-order')
    },
    [networkId, getProtocolFee, getGasPriceForOrders, notifyCallback, user, web3, track, payWithWeth],
  )

  const broadcastOrder = useCallback(
    async (order: SignedOrder) => {
      const url = `${httpEndpoint}sra/v3/orders`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([order]),
      })
      if (res.status === 200) return toast.success('Order successfully broadcasted')
      const jsonRes = await res.json()
      toast.error(jsonRes.validationErrors[0].reason)
    },
    [httpEndpoint, toast],
  )

  const cancelOrders = useCallback(
    async (orders: SignedOrder[], callback: Function) => {
      const exchange = new web3.eth.Contract(abi, addresses[networkId].zeroxExchange)

      await exchange.methods
        .batchCancelOrders(orders)
        .send({
          from: user,
        })
        .on('transactionHash', notifyCallback)
      track('cancel-order')
      callback()
    },
    [web3, notifyCallback, networkId, track, user],
  )

  return { getProtocolFee, fillOrders, fillOrder, createOrder, broadcastOrder, cancelOrders }
}
