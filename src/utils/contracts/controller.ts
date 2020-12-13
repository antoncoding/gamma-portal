import BigNumber from "bignumber.js";
import Web3 from 'web3' 
import {SmartContract} from './base'
import {addresses, ZERO_ADDR} from '../../constants/addresses'
import {actionArg, ActionType} from '../../types'
import {getPreference} from '../../utils/storage'
import {MAX_UINT} from '../../constants/others'

const abi = require('../../constants/abis/controller.json')
const erc20Abi = require('../../constants/abis/erc20.json')

export class Controller extends SmartContract {
  public contract: any
  public actions: actionArg[]
  public errCallback: Function | undefined
  constructor (_web3: Web3|null, networkId: number, account: string, errorCallback?: Function) {
    super(_web3, networkId, account)
    const address = addresses[networkId].controller;
    this.actions = []
    this.errCallback = errorCallback
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(abi, address)
  }

  async openVault (account) {
    const counter = await this.contract.methods.getAccountVaultCounter(account).call()
    const newVulatId = new BigNumber(counter).plus(1)
    const openArg = createOpenVaultArg(account, newVulatId)
    await this.operate([openArg])
  }

  pushAddCollateralArg(account: string, vaultId: BigNumber, from: string, asset: string, amount: BigNumber) {
    const arg = createDepositCollateralArg(account, from, vaultId, asset, amount)
    this.actions.push(arg)
  }

  pushRemoveCollateralArg(account: string, vaultId: BigNumber, to: string, asset: string, amount: BigNumber) {
    const arg = createWithdrawCollateralArg(account, to, vaultId, asset, amount)
    this.actions.push(arg)
  }

  pushAddLongArg(account: string, vaultId: BigNumber, from: string, asset:string, amount: BigNumber) {
    const arg = createDepositLongArg(account, from, vaultId, asset, amount)
    this.actions.push(arg)
  }

  pushRemoveLongArg(account: string, vaultId: BigNumber, to: string, asset:string, amount: BigNumber) {
    const arg = createWithdrawLongArg(account, to, vaultId, asset, amount)
    this.actions.push(arg)
  }

  pushMintArg(account: string, vaultId: BigNumber, to: string, asset:string, amount: BigNumber) {
    const arg = createMintShortArg(account, to, vaultId, asset, amount)
    this.actions.push(arg)
  }

  pushBurnArg(account: string, vaultId: BigNumber, from: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    const arg = createBurnShortArg(account, from, vaultId, asset, amount)
    this.actions.push(arg)
  }

  /**
   * Simple methods: each action as individual tx.
   */

  async simpleAddCollateral(account: string, vaultId: BigNumber, from: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    await this.checkAndIncreaseAllowance(asset, from, amount.toString())
    const arg = createDepositCollateralArg(account, from, vaultId, asset, amount)
    await this.operate([arg])
  }

  async simpleRemoveCollateral(account: string, vaultId: BigNumber, to: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    const arg = createWithdrawCollateralArg(account, to, vaultId, asset, amount)
    await this.operate([arg])
  }

  async simpleAddLong(account: string, vaultId: BigNumber, from: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    await this.checkAndIncreaseAllowance(asset, from, amount.toString())
    const arg = createDepositLongArg(account, from, vaultId, asset, amount)
    await this.operate([arg])
  }

  async simpleRemoveLong(account: string, vaultId: BigNumber, to: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    const arg = createWithdrawLongArg(account, to, vaultId, asset, amount)
    await this.operate([arg])
  }

  async simpleBurn(account: string, vaultId: BigNumber, from: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    const arg = createBurnShortArg(account, from, vaultId, asset, amount)
    await this.operate([arg])
  }

  async simpleMint(account: string, vaultId: BigNumber, to: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    const arg = createMintShortArg(account, to, vaultId, asset, amount)
    await this.operate([arg])
  }

  async simpleSettle(account: string, vaultId: BigNumber, to: string) {
    if (this.web3 === null) return
    const arg = createSettleArg(account, to, vaultId)
    await this.operate([arg])
  }

  async settleBatch(account: string, vaultIds: number[], to: string) {
    if (this.web3 === null) return
    const args = vaultIds.map(id => createSettleArg(account, to, new BigNumber(id)))
    await this.operate(args)
  }

  async redeemBatch(to: string, tokens: string[], amounts: BigNumber[]) {
    const args: actionArg[] = []
    for(let i = 0; i < tokens.length; i++) {
      args.push(createRedeemArg(tokens[i], amounts[i].toString(), to))
    }
    if (args.length === 0 && typeof this.errCallback === 'function') this.errCallback('No tokens to redeem.')

    await this.operate(args)
  }

  async refreshConfig() {
    if (this.web3 === null) {
      return
    }
    await this.contract.methods
      .refreshConfiguration()
      .send({from: this.account})
      .on('transactionHash', this.getCallback())
  }

  async operate (args: actionArg[]) {
    await this.contract.methods
      .operate(args)
      .send({from: this.account})
      .on('transactionHash', this.getCallback());
  }

  async operateCache(callback: Function) {
    // check allowance to add long
    const addLongAction = this.actions.find(action => action.actionType === ActionType.DepositLongOption)
    if (addLongAction !== undefined) {
      await this.checkAndIncreaseAllowance(addLongAction.asset, this.account, addLongAction.amount) 
    }

    try {
      // check allowance to add collateral
      const addCollateralAction = this.actions.find(action => action.actionType === ActionType.DepositCollateral)
      if (addCollateralAction !== undefined) {
        await this.checkAndIncreaseAllowance(addCollateralAction.asset, this.account, addCollateralAction.amount)
      }

      await this.contract.methods
        .operate(this.actions)
        .send({from: this.account})
        .on('transactionHash', this.getCallback())
        .on('receipt', callback);
      this.actions = [] 
      }
     catch (error) {
      if(typeof this.errCallback === 'function') this.errCallback(error)
    }

  }

  async checkAndIncreaseAllowance(erc20: string, from: string, amount: string) {
    if (!this.web3) return
    const pool = addresses[this.networkId].pool;
    const token = new this.web3.eth.Contract(erc20Abi, erc20)
    const allowance = await token.methods.allowance(from, pool).call()
    if (new BigNumber(allowance).lt(new BigNumber(amount))) {
      const approveAmount = getPreference('approval', 'normal') === 'normal' ? amount : MAX_UINT
      await token.methods.approve(pool, approveAmount).send({from: this.account}).on('transactionHash', this.getCallback())
    }
  }

  async updateOperator(operator: string, isOperator: boolean) {
    await this.contract.methods
      .setOperator(operator, isOperator)
      .send({from: this.account})
      .on('transactionHash', this.getCallback())
  }
}

// util functions for action library

function createOpenVaultArg(account: string, vaultId: BigNumber) : actionArg {
  return {
    actionType: ActionType.OpenVault,
    owner: account,
    secondAddress: account,
    asset: ZERO_ADDR,
    vaultId: vaultId.toString(),
    amount: '0',
    index: '0',
    data: ZERO_ADDR,
  }
}

function createDepositCollateralArg(account: string, from:string, vaultId: BigNumber, asset: string, amount: BigNumber) : actionArg {
  return {
    actionType: ActionType.DepositCollateral,
    owner: account,
    secondAddress: from,
    asset: asset,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

function createWithdrawCollateralArg(account: string, to: string, vaultId: BigNumber, asset: string, amount: BigNumber) : actionArg {
  return {
    actionType: ActionType.WithdrawCollateral,
    owner: account,
    secondAddress: to,
    asset: asset,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

function createMintShortArg(account: string, to:string, vaultId: BigNumber, oToken: string, amount: BigNumber) : actionArg {
  return {
    actionType: ActionType.MintShortOption,
    owner: account,
    secondAddress: to,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

function createBurnShortArg(account: string, from: string, vaultId: BigNumber, oToken: string, amount: BigNumber) : actionArg {
  return {
    actionType: ActionType.BurnShortOption,
    owner: account,
    secondAddress: from,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

function createDepositLongArg(account: string, from:string, vaultId: BigNumber, oToken: string, amount: BigNumber) : actionArg {
  return {
    actionType: ActionType.DepositLongOption,
    owner: account,
    secondAddress: from,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

function createWithdrawLongArg(account: string, to: string, vaultId: BigNumber, oToken: string, amount: BigNumber) : actionArg {
  return {
    actionType: ActionType.WithdrawLongOption,
    owner: account,
    secondAddress: to,
    asset: oToken,
    vaultId: vaultId.toString(),
    amount: amount.toString(),
    index: '0',
    data: ZERO_ADDR,
  }
}

function createSettleArg(account: string, to: string, vaultId: BigNumber) : actionArg {
  return {
    actionType: ActionType.SettleVault,
    owner: account,
    secondAddress: to,
    asset: ZERO_ADDR,
    vaultId: vaultId.toString(),
    amount: '0',
    index: '0',
    data: ZERO_ADDR,
  }
}

function createRedeemArg(token: string, amount: string, to:string) : actionArg {
  return {
    actionType: ActionType.Redeem,
    owner: ZERO_ADDR,
    secondAddress: to,
    asset: token,
    vaultId: '0',
    amount: amount,
    index: '0',
    data: ZERO_ADDR,
  }
}