import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useToast } from '@aragon/ui'
import { useConnectedWallet } from '../contexts/wallet'
import { addresses } from '../constants'
import { useNotify } from './useNotify'
import { SignedOrder } from '../types'
import { useGasPrice } from './useGasPrice'

const FEE_PERORDER_PER_GWEI = 0.00007

const abi = require('../constants/abis/0xExchange.json')

export function use0xExchange() {
  const toast = useToast()
  const { networkId, web3, user } = useConnectedWallet()
  const { notifyCallback } = useNotify()

  const { fast } = useGasPrice(5)

  const getProtocolFee = useCallback(
    (numOfOrders: number) => {
      return fast.times(new BigNumber(numOfOrders)).times(FEE_PERORDER_PER_GWEI)
    },
    [fast],
  )

  const fillOrders = useCallback(
    async (orders: SignedOrder[], amounts: BigNumber[]) => {
      if (!web3) return toast('No wallet detected')
      if (!orders.length) return toast('No Orders selected')
      const exchange = new web3.eth.Contract(abi, addresses[networkId].zeroxExchange)

      const signatures = orders.map(order => order.signature)

      const feeInEth = getProtocolFee(orders.length).toString()
      const amountsStr = amounts.map(amount => amount.toString())

      await exchange.methods
        .batchFillOrders(orders, amountsStr, signatures)
        .send({
          from: user,
          value: web3.utils.toWei(feeInEth, 'ether'),
          gasPrice: web3.utils.toWei(fast.toString(), 'gwei'),
        })
        .on('transactionHash', notifyCallback)
    },
    [networkId, getProtocolFee, fast, notifyCallback, toast, user, web3],
  )

  return { getProtocolFee, fillOrders }
}
