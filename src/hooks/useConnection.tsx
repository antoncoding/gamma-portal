import { useState, useEffect, useCallback, useMemo } from 'react'
import { getPreference, storePreference } from '../utils/storage'
import Onboard from 'bnc-onboard';
import Web3 from 'web3';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY;
const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;

export const useConnection = () => {
  const [user, setUser] = useState<string>('')
  const [web3, setWeb3] = useState<Web3>(null)

  // function for block native sdk when address is updated
  const setAddressCallback = useCallback((address: string | undefined) => {
    if (!address) {
      setUser('')
    } else {
      setUser(address)
    }
  }, [])

  // function for block native sdk when wallet is updated
  const setWalletCallback = useCallback((wallet) => {
    storePreference('selectedWallet', wallet.name);
    const web3Instance = new Web3(wallet.provider);
    setWeb3(web3Instance)
  }, [])


  const onboard = useMemo(() => initOnboard(setAddressCallback, setWalletCallback, 4), [setAddressCallback, setWalletCallback])

  // get last connection info and try to set default user to previous connected account.
  useEffect(() => {
    if (onboard === null) return
    async function getDefault() {
      const previouslySelectedWallet = getPreference('selectedWallet', 'null');
      if (previouslySelectedWallet === 'null') return

      const selected = await onboard.walletSelect(previouslySelectedWallet)

      if (selected) {
        const address = onboard.getState().address;
        if(address !== null) setAddressCallback(address);
      }

    };
    getDefault();
  },
  [onboard, setAddressCallback]
)

  const connect = useCallback(async () => {
    const selected = await onboard.walletSelect();
    if (!selected) return false;
    const checked = await onboard.walletCheck();
    if (!checked) return false;
    return onboard.getState().address;
  }, [onboard]);

  const disconnect = useCallback(async () => {
    onboard.walletReset();
  }, [onboard]);

  return { user, setUser, web3, connect, disconnect }
}

export const initOnboard = (setAddressCallback, setWalletCallback, networkId:number) => {

  const onboard = Onboard({
    darkMode: getPreference('theme', 'light') === 'dark',
    dappId: BLOCKNATIVE_KEY, // [String] The API key created by step one above
    networkId: networkId, // [Integer] The Ethereum network ID your Dapp uses.
    subscriptions: {
      address: setAddressCallback,
      wallet: setWalletCallback,
    },
    walletSelect: {
      description: 'Please select a wallet to connect to Opyn Monitor',
      wallets: [
        { walletName: 'metamask' },
        {
          walletName: 'walletConnect',
          infuraKey: INFURA_KEY,
        },
        {
          walletName: 'fortmatic',
          apiKey: FORTMATIC_KEY,
        },
        { walletName: 'trust' },
        { walletName: 'coinbase' },
        { walletName: 'status' },
      ],
    },
  });
  return onboard
};