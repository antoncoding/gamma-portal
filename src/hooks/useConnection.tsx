import { useState, useEffect, useCallback } from 'react'
import { getPreference, storePreference } from '../utils/storage'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import { networkToProvider, SupportedNetworks } from '../constants'

const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY
const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY

export const useConnection = () => {
  const [user, setUser] = useState<string>('')

  const [onboard, setOnboard] = useState<any>(null)

  const [web3, setWeb3] = useState<Web3>(new Web3(networkToProvider[SupportedNetworks.Mainnet]))

  const storedNetwork = Number(getPreference('gamma-networkId', '1'))
  const [networkId, setNetworkId] = useState<SupportedNetworks>(storedNetwork)

  // function for block native sdk when address is updated
  const setAddressCallback = useCallback((address: string | undefined) => {
    if (!address) {
      setUser('')
    } else {
      setUser(address.toLowerCase())
    }
  }, [])

  // function for block native sdk when wallet is updated
  const setWalletCallback = useCallback(wallet => {
    storePreference('selectedWallet', wallet.name)
    const web3Instance = new Web3(wallet.provider)
    setWeb3(web3Instance)
  }, [])

  const handleNetworkChange = useCallback(
    _networkId => {
      if (_networkId in SupportedNetworks) {
        setNetworkId(_networkId)
        storePreference('gamma-networkId', _networkId.toString())
      }
      if (onboard)
        onboard.config({
          networkId: _networkId,
        })
    },
    [onboard],
  )

  useEffect(() => {
    if (onboard !== null) return
    const newOnboard = initOnboard(setAddressCallback, setWalletCallback, handleNetworkChange, networkId)
    setOnboard(newOnboard)
  }, [setAddressCallback, setWalletCallback, handleNetworkChange, networkId, onboard])

  // get last connection info and try to set default user to previous connected account.
  useEffect(() => {
    async function getDefault() {
      if (!onboard) return
      const previouslySelectedWallet = getPreference('selectedWallet', 'null')
      if (previouslySelectedWallet === 'null') return
      const selected = await onboard.walletSelect(previouslySelectedWallet)

      if (selected) {
        const address = onboard.getState().address
        if (address !== null) setAddressCallback(address)
      }
    }
    getDefault()
  }, [onboard, setAddressCallback])

  const connect = useCallback(async () => {
    if (!onboard) return
    const selected = await onboard.walletSelect()
    if (!selected) return false
    const checked = await onboard.walletCheck()
    if (!checked) return false
    const account = onboard.getState().address
    setUser(account.toLowerCase())
    return account
  }, [onboard])

  const disconnect = useCallback(async () => {
    onboard.walletReset()
    setUser('')
  }, [onboard])

  return { networkId, user, setUser, web3, connect, disconnect }
}

export const initOnboard = (addressChangeCallback, walletChangeCallback, networkChangeCallback, networkId) => {
  const onboard = Onboard({
    darkMode: getPreference('theme', 'light') === 'dark',
    dappId: BLOCKNATIVE_KEY, // [String] The API key created by step one above
    networkId: networkId, // [Integer] The Ethereum network ID your Dapp uses.
    subscriptions: {
      address: addressChangeCallback,
      wallet: walletChangeCallback,
      network: networkChangeCallback,
    },
    walletSelect: {
      description: 'Please select a wallet to connect to the blockchain',
      wallets: [
        { walletName: 'walletLink', preferred: true, rpcUrl: networkToProvider[networkId] },
        { walletName: 'metamask', preferred: true },
        {
          walletName: 'walletConnect',
          rpc: {
            [SupportedNetworks.Mainnet]: networkToProvider[SupportedNetworks.Mainnet],
            [SupportedNetworks.Ropsten]: networkToProvider[SupportedNetworks.Ropsten],
            [SupportedNetworks.Kovan]: networkToProvider[SupportedNetworks.Kovan],
            [SupportedNetworks.Arbitrum]: networkToProvider[SupportedNetworks.Arbitrum],
            [SupportedNetworks.Avalanche]: networkToProvider[SupportedNetworks.Avalanche],
            [SupportedNetworks.Matic]: networkToProvider[SupportedNetworks.Matic],
          }, // [Optional]
          preferred: true,
        },
        {
          walletName: 'fortmatic',
          apiKey: FORTMATIC_KEY,
          preferred: true,
        },
        { walletName: 'lattice', appName: 'Gamma Portal', rpcUrl: networkToProvider[networkId], preferred: true },
      ],
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ],
  })
  return onboard
}
