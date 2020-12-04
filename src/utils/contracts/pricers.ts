import Web3 from 'web3' 
import BigNumber from 'bignumber.js'
import {SmartContract} from './base'
const cTokenPricerABI = require('../../constants/abis/cTokenPricer.json')
const usdcPricerABI = require('../../constants/abis/usdcPricer.json')
const CLPricerABI = require('../../constants/abis/chainlinkPricer.json')
const CLAggregatorABI = require('../../constants/abis/chainlinkAggregator.json')

export class CTokenPricer extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, pricerAddr: string, networkId: number, account: string) {
    super(_web3, networkId, account)
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(cTokenPricerABI, pricerAddr)
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

export class CLPricer extends SmartContract {
  public contract: any
  constructor (_web3: Web3|null, pricerAddr: string, networkId: number, account: string) {
    super(_web3, networkId, account)
    if (this.web3 !== null)
      this.contract = new this.web3.eth.Contract(CLPricerABI, pricerAddr)
  } 

  async setPrice (
    expiry: string,
    errorCallback?: any,
    searchingCallback?: any
  ) {
    if (this.web3 === null) return;
    const aggregatorAddr = await this.contract.methods.aggregator().call()
    const aggregator = new this.web3.eth.Contract(CLAggregatorABI, aggregatorAddr)
    const latestId = await aggregator.methods.latestRound().call()
    const lastTimestamp = await aggregator.methods.getTimestamp(latestId).call()
    if (new BigNumber(lastTimestamp).lt(new BigNumber(expiry))) {
      if (typeof errorCallback === 'function') errorCallback('Chainlink Oralce price not updated yet.')
      return
    }
    // latest id has timestamp > expiry!
    
    let id = new BigNumber(latestId.toString())
    while(true) {
      if(typeof searchingCallback === 'function') searchingCallback(true)
      const prevTimestamp = new BigNumber(await aggregator.methods.getTimestamp(id.minus(1)).call())
      if (prevTimestamp.lt(new BigNumber(expiry))) {
        if(typeof searchingCallback === 'function') searchingCallback(false)
        await this.contract.methods
          .setExpiryPriceInOracle(expiry, id)
          .send({from: this.account})
          .on('transactionHash', this.getCallback());
        break
      }
      id = id.minus(1)
    }
  }
}