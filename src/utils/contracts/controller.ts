import BigNumber from "bignumber.js";
import Web3 from 'web3' 
import {SmartContract} from './base'
import {addressese, ZERO_ADDR} from '../../constants/addresses'
import {actionArg, ActionType} from '../../types'

const abi = require('../../constants/abis/controller.json')
const erc20Abi = require('../../constants/abis/erc20.json')

export class Controller extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, networkId: number, account: string) {
    super(_web3, networkId, account)
    const address = addressese[networkId].controller;
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(abi, address)
  }

  async openVault (account) {
    const counter = await this.contract.methods.getAccountVaultCounter(account).call()
    const newVulatId = new BigNumber(counter).plus(1)
    const openArg = createOpenVaultArg(account, newVulatId)
    await this.operate([openArg])
  }

  async simpleAddCollateral(account: string, vaultId: BigNumber, from: string, asset:string, amount: BigNumber) {
    if (this.web3 === null) return
    const collateral = new this.web3.eth.Contract(erc20Abi, asset)
    const pool = addressese[this.networkId].pool;
    const allowance = await collateral.methods.allowance(from, pool).call()
    if (new BigNumber(allowance).lt(amount)) {
      await collateral.methods.approve(pool, amount.toString()).send({from: this.account}).on('transactionHash', this.getCallback())
    }
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
    const oToken = new this.web3.eth.Contract(erc20Abi, asset)
    const pool = addressese[this.networkId].pool;
    const allowance = await oToken.methods.allowance(from, pool).call()
    if (new BigNumber(allowance).lt(amount)) {
      await oToken.methods.approve(pool, amount.toString()).send({from: this.account}).on('transactionHash', this.getCallback())
    }
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

  async operate (args: actionArg[]) {
    await this.contract.methods
      .operate(args)
      .send({from: this.account})
      .on('transactionHash', this.getCallback());
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