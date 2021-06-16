import React, { useMemo } from 'react'

import { Info } from '@aragon/ui'
import MintToken from './mintToken'
import { useConnectedWallet } from '../../../contexts/wallet'
import { SupportedNetworks } from '../../../constants/networks'
import Header from '../../../components/Header'
import StyledContainer from '../../../components/StyledContainer'
import { tokens } from '../../../constants/addresses'

export default function Faucet() {
  const { networkId } = useConnectedWallet()

  const mintableTokens = useMemo(() => tokens[networkId].filter(token => token.canMint), [networkId])

  return (
    <StyledContainer>
      <Header primary={'Token Faucet'} />

      {networkId === SupportedNetworks.Mainnet ? (
        <Info title="Info">
          {' '}
          You're currently on mainnet. Switch network in your wallet to testnet to get faucet tokens and start testing!{' '}
        </Info>
      ) : (
        <Info title="Note"> These tokens are for testing purpose only, and are only guaranteed to work with Opyn </Info>
      )}

      {mintableTokens.map((token, i) => {
        return <MintToken token={token} key={i} />
      })}
    </StyledContainer>
  )
}
