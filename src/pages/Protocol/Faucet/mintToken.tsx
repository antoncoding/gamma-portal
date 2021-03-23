import React, { useMemo, useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { TextInput, Button, useTheme, LoadingRing } from '@aragon/ui'

import SectionHeader from '../../../components/SectionHeader'
import Warning from '../../../components/Warning'
import { useConnectedWallet } from '../../../contexts/wallet'

import { Token } from '../../../types'
import { fromTokenAmount, toTokenAmount } from '../../../utils/math'
import { useNotify } from '../../../hooks/useNotify'
import { useTokenBalance } from '../../../hooks'

const abi = require('../../../constants/abis/mintableErc20.json')

export default function MintToken({ token }: { token: Token }) {
  const { web3, user } = useConnectedWallet()
  const { notifyCallback } = useNotify()
  const theme = useTheme()

  const [amount, setAmount] = useState(0)
  const [isMinting, setIsMinting] = useState(false)

  const contract = useMemo(() => new web3.eth.Contract(abi, token.id), [token.id, web3])

  const mintAmount = useMemo(() => fromTokenAmount(new BigNumber(amount), token.decimals), [amount, token.decimals])

  const tokenBalance = useTokenBalance(token.id, user, 10)

  const isGreedy = useMemo(() => amount > 300000, [amount])

  const mint = useCallback(async () => {
    setIsMinting(true)
    try {
      await contract.methods
        .mint(user, mintAmount.toString())
        .send({ from: user })
        .on('transactionHash', notifyCallback)
        .on('confirmation', () => setIsMinting(false))
    } catch (error) {
      setIsMinting(false)
    }
  }, [notifyCallback, contract, mintAmount, user])

  return (
    <>
      <SectionHeader title={`Mint Opyn ${token.symbol}`} />
      <div style={{ fontSize: 14, color: theme.contentSecondary }}>
        My Balance: {toTokenAmount(tokenBalance, token.decimals).toFormat(4)} {token.symbol}
      </div>
      <Warning text="You're being greedy!" show={isGreedy} />
      <div style={{ display: 'flex' }}>
        <TextInput type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <Button onClick={mint} disabled={isMinting || isGreedy}>
          {' '}
          {isMinting ? <LoadingRing /> : 'Mint'}{' '}
        </Button>
      </div>
    </>
  )
}
