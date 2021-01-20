import { useCallback, useState, useMemo, useEffect } from 'react'
import ReactGA from 'react-ga'
import BigNumber from 'bignumber.js'
import { useConnectedWallet } from '../contexts/wallet'
import { useToast } from '@aragon/ui'

import { addresses } from '../constants/addresses'
import { actionArg, ActionType } from '../types'
import { getPreference } from '../utils/storage'
import { MAX_UINT } from '../constants/others'

import * as util from '../utils/controller'
import { useNotify } from './useNotify'
import { SupportedNetworks } from '../constants'

const abi = require('../constants/abis/controller.json')
const erc20Abi = require('../constants/abis/erc20.json')

export function useController() {
  const toast = useToast()

  const { networkId, user, web3 } = useConnectedWallet()

  const [latestVaultId, setLatestVaultId] = useState(0)

  const track = useCallback(
    (action: string) => {
      const label = networkId === SupportedNetworks.Mainnet ? 'mainnet' : 'kovan'
      ReactGA.event({ category: 'controller', action, label })
    },
    [networkId],
  )

  const { notifyCallback } = useNotify()

  const controller = useMemo(() => {
    if (!web3) return null
    const address = addresses[networkId].controller
    return new web3.eth.Contract(abi, address)
  }, [networkId, web3])

  const updateVaultId = useCallback(() => {
    if (!controller || !user) return
    controller.methods
      .getAccountVaultCounter(user)
      .call()
      .then(counter => {
        setLatestVaultId(Number(counter))
      })
  }, [controller, user])

  useEffect(() => {
    updateVaultId()
  }, [updateVaultId])

  const operate = useCallback(
    async (args: actionArg[]) => {
      if (!controller) return toast('No wallet connected')
      try {
        await controller.methods.operate(args).send({ from: user }).on('transactionHash', notifyCallback)
      } catch (error) {
        const message = error.message ? error.message : error.toString()
        toast(message)
      }
    },
    [notifyCallback, controller, user, toast],
  )

  const [actions, setActions] = useState<actionArg[]>([])

  const pushAction = useCallback(newEntry => {
    setActions(actions => [...actions, newEntry])
  }, [])

  const openVault = useCallback(
    async account => {
      if (!controller) return toast('No wallet connected')
      const counter = await controller.methods.getAccountVaultCounter(account).call()
      const newVulatId = new BigNumber(counter).plus(1)
      const openArg = util.createOpenVaultArg(account, newVulatId)
      track('open-vault')
      await operate([openArg])
    },
    [operate, controller, toast, track],
  )

  const pushAddCollateralArg = useCallback(
    (account: string, vaultId: BigNumber, from: string, asset: string, amount: BigNumber) => {
      const arg = util.createDepositCollateralArg(account, from, vaultId, asset, amount)
      pushAction(arg)
      track('add-collateral')
    },
    [pushAction, track],
  )

  const pushRemoveCollateralArg = useCallback(
    (account: string, vaultId: BigNumber, to: string, asset: string, amount: BigNumber) => {
      const arg = util.createWithdrawCollateralArg(account, to, vaultId, asset, amount)
      pushAction(arg)
      track('remove-collateral')
    },
    [pushAction, track],
  )

  const pushAddLongArg = useCallback(
    (account: string, vaultId: BigNumber, from: string, asset: string, amount: BigNumber) => {
      const arg = util.createDepositLongArg(account, from, vaultId, asset, amount)
      pushAction(arg)
      track('add-long')
    },
    [pushAction, track],
  )

  const pushRemoveLongArg = useCallback(
    (account: string, vaultId: BigNumber, to: string, asset: string, amount: BigNumber) => {
      const arg = util.createWithdrawLongArg(account, to, vaultId, asset, amount)
      pushAction(arg)
      track('remove-long')
    },
    [pushAction, track],
  )

  const pushMintArg = useCallback(
    (account: string, vaultId: BigNumber, to: string, asset: string, amount: BigNumber) => {
      const arg = util.createMintShortArg(account, to, vaultId, asset, amount)
      pushAction(arg)
      track('mint-short')
    },
    [pushAction, track],
  )

  const pushBurnArg = useCallback(
    (account: string, vaultId: BigNumber, from: string, asset: string, amount: BigNumber) => {
      if (!web3) return
      const arg = util.createBurnShortArg(account, from, vaultId, asset, amount)
      pushAction(arg)
      track('burn-short')
    },
    [pushAction, web3, track],
  )

  const settleBatch = useCallback(
    async (account: string, vaultIds: number[], to: string) => {
      if (!web3) return toast('No wallet connected')
      const args = vaultIds.map(id => util.createSettleArg(account, to, new BigNumber(id)))
      track('settle-batch')
      await operate(args)
    },
    [operate, web3, toast, track],
  )

  const redeemBatch = useCallback(
    async (to: string, tokens: string[], amounts: BigNumber[]) => {
      const args: actionArg[] = []
      for (let i = 0; i < tokens.length; i++) {
        args.push(util.createRedeemArg(tokens[i], amounts[i].toString(), to))
      }
      if (args.length === 0) return toast('No tokens to redeem.')
      track('redeem-batch')
      await operate(args)
    },
    [operate, toast, track],
  )

  const refreshConfig = useCallback(async () => {
    if (controller === null) return toast('No wallet connected')
    await controller.methods.refreshConfiguration().send({ from: user }).on('transactionHash', notifyCallback)
  }, [notifyCallback, user, controller, toast])

  const checkAndIncreaseAllowance = useCallback(
    async (erc20: string, from: string, amount: string) => {
      if (!web3) return
      const pool = addresses[networkId].pool
      const token = new web3.eth.Contract(erc20Abi, erc20)
      const allowance = await token.methods.allowance(from, pool).call()
      if (new BigNumber(allowance).lt(new BigNumber(amount))) {
        const approveAmount = getPreference('approval', 'unlimited') === 'normal' ? amount : MAX_UINT
        await token.methods.approve(pool, approveAmount).send({ from: user }).on('transactionHash', notifyCallback)
      }
    },
    [networkId, notifyCallback, user, web3],
  )

  const operateCache = useCallback(
    async (callback: Function, onError: Function) => {
      // check allowance to add long
      if (!controller) {
        onError()
        return toast('No wallet connected')
      }
      const addLongAction = actions.find(action => action.actionType === ActionType.DepositLongOption)
      if (addLongAction !== undefined) {
        await checkAndIncreaseAllowance(addLongAction.asset, user, addLongAction.amount)
      }

      // check allowance to add collateral
      const addCollateralAction = actions.find(action => action.actionType === ActionType.DepositCollateral)
      if (addCollateralAction !== undefined) {
        await checkAndIncreaseAllowance(addCollateralAction.asset, user, addCollateralAction.amount)
      }

      const actionVaultId = Number(actions.find(action => action.vaultId !== '0')?.vaultId)
      if (actionVaultId) {
        if (actionVaultId === latestVaultId + 1) {
          // open new vault
          actions.unshift(util.createOpenVaultArg(user, new BigNumber(actionVaultId)))
        } else if (actionVaultId > latestVaultId + 1) {
          onError()
          return toast(`Cannot operate on vault id > ${latestVaultId + 1} `)
        }
      }

      try {
        await controller.methods
          .operate(actions)
          .send({ from: user })
          .on('transactionHash', notifyCallback)
          .on('receipt', callback)
          .on('error', onError)
        setActions([])
      } catch (error) {
        toast(error.message)
        onError()
      }

      updateVaultId()
    },
    [controller, toast, actions, checkAndIncreaseAllowance, notifyCallback, user, updateVaultId, latestVaultId],
  )

  const cleanActionCache = useCallback(() => {
    setActions([])
  }, [])

  const updateOperator = useCallback(
    async (operator: string, isOperator: boolean) => {
      if (!controller) return toast('No wallet connected')
      track('update-operator')
      await controller.methods
        .setOperator(operator, isOperator)
        .send({ from: user })
        .on('transactionHash', notifyCallback)
    },
    [toast, controller, notifyCallback, user, track],
  )

  return {
    actions,
    openVault,
    pushAddCollateralArg,
    pushRemoveCollateralArg,
    pushAddLongArg,
    pushRemoveLongArg,
    pushMintArg,
    pushBurnArg,
    settleBatch,
    redeemBatch,
    refreshConfig,
    operateCache,
    updateOperator,
    latestVaultId,
    cleanActionCache,
  }
}
