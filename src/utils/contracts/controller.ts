import BigNumber from "bignumber.js";
import Web3 from 'web3' 
import {SmartContract} from './base'
import {addressese, ZERO_ADDR} from '../../constants/addresses'
import {actionArg, ActionType} from '../../types'

const abi = require('../../constants/abis/controller.json')

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
    console.log(`counter`, counter)
    const openArg = {
      actionType: ActionType.OpenVault,
      owner: account,
      secondAddress: account,
      asset: ZERO_ADDR,
      vaultId: new BigNumber(counter).plus(1).toString(),
      amount: '0',
      index: '0',
      data: ZERO_ADDR,
    }
    await this.operate([openArg])
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
