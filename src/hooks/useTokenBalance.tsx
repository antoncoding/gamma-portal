import { useEffect, useState, useContext } from 'react';
import BigNumber from 'bignumber.js';
import Web3 from 'web3' 
import { walletContext } from '../contexts/wallet';
import { ZERO_ADDR } from '../constants/addresses';

const erc20Abi = require('../constants/abis/erc20.json');

/**
 * get token balance.
 * @param token token address
 * @param refetchIntervalSec refetch interval in seconds
 * @returns {BigNumber} raw balance
 */
export const useTokenBalance = (token: string, account: string, refetchIntervalSec: number): BigNumber => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { web3, networkId } = useContext(walletContext)
  useEffect(() => {
    let isCancelled = false;

    async function updateBalance() {
      if (!token) return;
      if (!account) return;
      if (!web3) return 
      const price = await getBalance(web3, token, account);
      if (!isCancelled) setBalance(price);
    }
    updateBalance();
    const id = setInterval(updateBalance, refetchIntervalSec * 1000);

    // cleanup function: remove interval
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [token, refetchIntervalSec, account, networkId, web3]);

  return balance;
};

async function getBalance(web3: Web3, token: string, account: string) {
  if (token === ZERO_ADDR) return new BigNumber(0)
  const erc20 = new web3.eth.Contract(erc20Abi, token);
  const t = await erc20.methods.balanceOf(account).call();
  return new BigNumber(t.toString());
}
