import { useState, useEffect } from 'react'
import { useConnectedWallet } from '../contexts/wallet'
import BigNumber from 'bignumber.js'

const abi = require('../constants/abis/erc20.json')

export function useUserAllowance(token: string, spender: string) {
  const { web3, user } = useConnectedWallet()

  const [allowance, setAllowance] = useState(new BigNumber(0))
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(true)

  useEffect(() => {
    if (!web3) return
    const erc = new web3.eth.Contract(abi, token)
    erc.methods
      .allowance(user, spender)
      .call()
      .then(allowance => {
        setAllowance(new BigNumber(allowance.toString()))
        setIsLoadingAllowance(false)
      })
      .catch(err => {
        setIsLoadingAllowance(false)
      })
  }, [web3, spender, token, user])

  return { allowance, isLoadingAllowance }
}
