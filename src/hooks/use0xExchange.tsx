import { useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import BigNumber from 'bignumber.js'
import { useToast } from '@aragon/ui'
import { useConnectedWallet } from '../contexts/wallet'
import { addresses, ZeroXEndpoint, SupportedNetworks } from '../constants'
import { useNotify } from './useNotify'
import { SignedOrder } from '../types'
import { useGasPrice } from './useGasPrice'
import { zx_exchange } from '../constants/addresses'
import { assetDataUtils, signatureUtils, SupportedProvider } from '@0x/order-utils'
import { MetamaskSubprovider } from '@0x/subproviders'
const FEE_PERORDER_PER_GWEI = 0.00007
const FEE_RECIPIENT = '0x200aabfDB21BEb86250fFE93Cac78dc9B9fa3e7d'

const abi = require('../constants/abis/0xExchange.json')

export function use0xExchange() {
  const toast = useToast()
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
    ) => {
      if (!web3) return toast('No Wallet Connected')
      const exchangeAddress = zx_exchange[networkId]
      const salt = BigNumber.random(20)
        .times(new BigNumber(10).pow(new BigNumber(20)))
        .integerValue()
      const order = {
        senderAddress: '0x0000000000000000000000000000000000000000',
        makerAddress: user,
        takerAddress: '0x0000000000000000000000000000000000000000',
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
    [networkId, user, web3, toast, track],
  )

  const fillOrders = useCallback(
    async (orders: SignedOrder[], amounts: BigNumber[]) => {
      if (!web3) return toast('No wallet detected')
      if (!orders.length) return toast('No Orders selected')
      const exchange = new web3.eth.Contract(abi, addresses[networkId].zeroxExchange)

      const signatures = orders.map(order => order.signature)

      const gasPrice = getGasPriceForOrders(orders)
      const feeInEth = getProtocolFee(orders).toString()
      const amountsStr = amounts.map(amount => amount.toString())

      await exchange.methods
        .batchFillOrders(orders, amountsStr, signatures)
        .send({
          from: user,
          value: web3.utils.toWei(feeInEth, 'ether'),
          gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei'),
        })
        .on('transactionHash', notifyCallback)

      track('fill-order')
    },
    [networkId, getProtocolFee, getGasPriceForOrders, notifyCallback, toast, user, web3, track],
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
      if (res.status === 200) return toast('Order successfully broadcasted')
      const jsonRes = await res.json()
      toast(jsonRes.validationErrors[0].reason)
    },
    [httpEndpoint, toast],
  )

  return { getProtocolFee, fillOrders, createOrder, broadcastOrder }
}
