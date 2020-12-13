import BigNumber from "bignumber.js";
import Web3 from 'web3' 
import {SmartContract} from './base'
import {addresses, ZERO_ADDR} from '../../constants/addresses'
const abi = require('../../constants/abis/factory.json')

export class OTokenFactory extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, networkId: number, account: string) {
    super(_web3, networkId, account)
    const factoryAddr = addresses[networkId].factory;
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

  async isCreated(
    underlying: string, 
    strike: string, 
    collateral: string, 
    strikePrice: BigNumber, 
    expiry: BigNumber, 
    isPut: boolean
  ) : Promise<boolean> {
    const deployedAddress = await this.contract.methods
      .getOtoken(underlying, strike, collateral, strikePrice.toString(), expiry.toString(), isPut)
      .call()

    return deployedAddress !== ZERO_ADDR
  }

  async getTargetOtokenAddress(
    underlying: string, 
    strike: string, 
    collateral: string, 
    strikePrice: BigNumber, 
    expiry: BigNumber, 
    isPut: boolean
  ) : Promise<string> {
    const targetAddress = await this.contract.methods
      .getTargetOtokenAddress(underlying, strike, collateral, strikePrice.toString(), expiry.toString(), isPut)
      .call()
    return targetAddress
  }
}
