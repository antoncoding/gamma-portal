import Web3 from 'web3' 
import {createNotify, networkIdToUrl} from '../notify'

export class SmartContract {
  public web3: Web3 | null
  public networkId: number
  public account: string
  public notify: any
  constructor (_web3: Web3|null, networkId: number, account: string) {
    this.web3 = _web3
    this.account = account
    this.networkId = networkId
    this.notify = createNotify(networkId)
  }

  // blockNative call back
  getCallback() {
    return (hash) => {
      const {emitter} = this.notify.hash(hash);
      emitter.on('all', (transaction) => {
        return {
          onclick: () => window.open(`${networkIdToUrl[this.networkId]}/${transaction.hash}`)
        }
      })
    }
  }
  
}


