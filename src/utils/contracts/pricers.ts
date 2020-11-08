import Web3 from 'web3' 
import {SmartContract} from './base'
const cTokenPricerABI = require('../../constants/abis/cTokenPricer.json')
const usdcPricerABI = require('../../constants/abis/usdcPricer.json')

export class CTokenPricer extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, pricerAddr: string, networkId: number, account: string) {
    super(_web3, networkId, account)
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(cTokenPricerABI, pricerAddr)

    console.log(`contract`, this.contract)
  } 

  async setPrice (
    expiry: string
  ) {
    await this.contract.methods
      .setExpiryPriceInOracle(expiry)
      .send({from: this.account})
      .on('transactionHash', this.getCallback());
  }
}

export class USDCPricer extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, pricerAddr: string, networkId: number, account: string) {
    console.log(`_web3`, _web3)
    super(_web3, networkId, account)
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(usdcPricerABI, pricerAddr)
  } 

  async setPrice (
    expiry: string
  ) {
    await this.contract.methods
      .setExpiryPriceInOracle(expiry)
      .send({from: this.account})
      .on('transactionHash', this.getCallback());
  }
}