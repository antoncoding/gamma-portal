import BigNumber from "bignumber.js";
import Web3 from 'web3' 
import {SmartContract} from './base'
import {addressese} from '../../constants/addresses'
const abi = require('../../constants/abis/factory.json')

export class OTokenFactory extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, networkId: number, account: string) {
    super(_web3, networkId, account)
    const factoryAddr = addressese[networkId].factory;
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(abi, factoryAddr)
  } 

  async createOToken (
    underlying: string, 
    strike: string, 
    collateral: string, 
    strikePrice: BigNumber, 
    expiry: BigNumber, 
    isPut: boolean
  ) {
    await this.contract.methods
      .createOtoken(underlying, strike, collateral, strikePrice.toString(), expiry.toString(), isPut)
      .send({from: this.account})
      .on('transactionHash', this.getCallback());
  }
}
